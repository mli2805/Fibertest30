using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public class LogProvider(ILogger<LogProvider> logger) : ILogProvider
{
    public async Task<List<(byte[], string)>> GetDataCenterLogs(CancellationToken ct)
    {
        return await GetFromFolder("../log/", "dataCenter", ct);
    }

    public async Task<List<(byte[], string)>> GetNginxLogs(CancellationToken ct)
    {
        return await GetFromFolder("/var/log/nginx/", "nginx", ct);
    }

    private async Task<List<(byte[], string)>> GetFromFolder(string folder, string nameIt, CancellationToken ct)
    {
        var result = new List<(byte[], string)>();
        
        try
        {
            var di = new DirectoryInfo(folder);
            var files = di.GetFiles();
            foreach (var file in files)
            {
                byte[]? bytes = await ReadStream(file.FullName, ct);
                if (bytes != null && bytes.Length > 0)
                {
                    result.Add((bytes, nameIt +"/" + file.Name));
                }
            }
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
        }

        return result;
    }

    private async Task<byte[]?> ReadStream(string path, CancellationToken ct)
    {
        try
        {
            // позволяет читать файлы открытые другими прогами на запись
            await using var fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var ms = new MemoryStream();
            await fs.CopyToAsync(ms, ct);
            return ms.ToArray();
        }
        catch (Exception e)
        {
            logger.LogError($"Failed to read: {path}");
            logger.LogError(e.Message);
            return null;
        }
    }

}
