using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public class LogProvider : ILogProvider
{
    private readonly ILogger<LogProvider> _logger;

    public LogProvider(ILogger<LogProvider> logger)
    {
        _logger = logger;
    }

    public async Task<List<(byte[], string)>> GetDataCenterLogs(CancellationToken ct)
    {
        var folder = "../log/";
        var result = new List<(byte[], string)>();
        ;
        try
        {
            var di = new DirectoryInfo(folder);
            var files = di.GetFiles();
            foreach (var file in files)
            {
                byte[]? bytes = await ReadStream(file.FullName, ct);
                if (bytes != null && bytes.Length > 0)
                {
                    result.Add((bytes, "dataCenter/" + file.Name));
                }
            }
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
        }

        return result;
    }

    public async Task<List<(byte[], string)>> GetNginxLogs(CancellationToken ct)
    {
        // var folder = "/var/log/nginx/";
        var folder = "c:/temp/";
        var result = new List<(byte[], string)>();
        try
        {
            byte[]? bytes1 = await ReadStream(Path.Combine(folder, "access.log"), ct);
            if (bytes1 != null && bytes1.Length > 0)
            {
                result.Add((bytes1, "nginx/" + "access.log"));
            }
            
            byte[]? bytes2 = await ReadStream(Path.Combine(folder, "error.log"), ct);
            if (bytes2 != null && bytes2.Length > 0)
            {
                result.Add((bytes2, "nginx/" + "error.log"));
            }
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
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
            _logger.LogError($"Failed to read: {path}");
            _logger.LogError(e.Message);
            return null;
        }
    }

}
