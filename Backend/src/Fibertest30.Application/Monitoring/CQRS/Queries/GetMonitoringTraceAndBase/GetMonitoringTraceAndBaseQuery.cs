using MediatR;
using System.IO.Compression;

namespace Fibertest30.Application;

public record GetMonitoringTraceAndBaseQuery(int MonitoringId) : IRequest<byte[]>;

public class GetMonitoringTraceAndBaseQueryHandler : IRequestHandler<GetMonitoringTraceAndBaseQuery, byte[]>
{
    private readonly IMonitoringRepository _monitoringRepository;
    private readonly IBaselineRepository _baselineRepository;
    private readonly IOtauRepository _otauRepository;
    private readonly IDeviceInfoProvider _deviceInfoProvider;

    public GetMonitoringTraceAndBaseQueryHandler(IMonitoringRepository monitoringRepository, 
        IBaselineRepository baselineRepository, IOtauRepository otauRepository, IDeviceInfoProvider deviceInfoProvider)
    {
        _monitoringRepository = monitoringRepository;
        _baselineRepository = baselineRepository;
        _otauRepository = otauRepository;
        _deviceInfoProvider = deviceInfoProvider;
    }

    public async Task<byte[]> Handle(GetMonitoringTraceAndBaseQuery request, CancellationToken ct)
    {
        var traceBytes = await _monitoringRepository.GetSor(request.MonitoringId);
        var monitoring = await _monitoringRepository.Get(request.MonitoringId, addExtra: false);
        var portName = await _otauRepository.GetPortNameByMonitoringPortId(monitoring.MonitoringPortId, ct);
        var baseBytes = await _baselineRepository.GetSor(monitoring.BaselineId, ct);
        var baseline = await _baselineRepository.Get(monitoring.BaselineId, ct);
        var timeZone = _deviceInfoProvider.GetTimeZone();

        using var compressedMemoryStream = new MemoryStream();
        using (var zip = new ZipArchive(compressedMemoryStream, ZipArchiveMode.Create))
        {
            var dateTime = TimeZoneInfo.ConvertTimeFromUtc(monitoring.CompletedAt.FromUnixTime(), timeZone);
            var traceSorFile = zip.CreateEntry($"monitoring-[{portName}]-[{dateTime:yyyy-MM-dd HH-mm-ss}].sor");
            using var traceStream = new MemoryStream(traceBytes);
            await using (var zipEntryStream = traceSorFile.Open())
            {
                await traceStream.CopyToAsync(zipEntryStream, ct);
            }

            dateTime = TimeZoneInfo.ConvertTimeFromUtc(baseline.CreatedAt, timeZone);
            var baseSorFile = zip.CreateEntry($"baseline-[{portName}]-[{dateTime:yyyy-MM-dd HH-mm-ss}].sor");
            using var baseStream = new MemoryStream(baseBytes);
            await using (var zipEntryStream = baseSorFile.Open())
            {
                await baseStream.CopyToAsync(zipEntryStream, ct);
            }
        }

        return compressedMemoryStream.ToArray();
    }
}
