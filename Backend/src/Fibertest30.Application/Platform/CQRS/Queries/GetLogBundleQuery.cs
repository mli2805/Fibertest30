using MediatR;
using System.IO.Compression;

namespace Fibertest30.Application;

public record GetLogBundleQuery : IRequest<byte[]>;

public class GetLogBundleQueryHandler(ILogProvider logProvider) : IRequestHandler<GetLogBundleQuery, byte[]>
{
    public async Task<byte[]> Handle(GetLogBundleQuery request, CancellationToken ct)
    {

        using var compressedMemoryStream = new MemoryStream();
        using (var zip = new ZipArchive(compressedMemoryStream, ZipArchiveMode.Create))
        {
            var dataCenterLogs = await logProvider.GetDataCenterLogs(ct);
            foreach ((byte[], string) dataCenterLog in dataCenterLogs)
            {
                var entry = zip.CreateEntry(dataCenterLog.Item2);
                using var stream = new MemoryStream(dataCenterLog.Item1);
                await using var entryAsStream = entry.Open();
                await stream.CopyToAsync(entryAsStream, ct);
            }

            var nginxLogs = await logProvider.GetNginxLogs(ct);
            foreach ((byte[], string) nginxLog in nginxLogs)
            {
                var entry = zip.CreateEntry(nginxLog.Item2);
                using var stream = new MemoryStream(nginxLog.Item1);
                await using var entryAsStream = entry.Open();
                await stream.CopyToAsync(entryAsStream, ct);
            }
        }

        // zip must be disposed at this point
        return compressedMemoryStream.ToArray();
    }
}