using MediatR;

namespace Fibertest30.Application;

public record GetLastMonitoringLinkmapQuery(int MonitoringPortId, int BaselineId, double MacrobendThreshold) : IRequest<byte[]?>;

public class GetLastMonitoringLinkmapQueryHandler : IRequestHandler<GetLastMonitoringLinkmapQuery, byte[]?>
{
    private readonly IMonitoringRepository _monitoringRepository;
    private readonly ILinkmapGenerator _linkmapGenerator;

    public GetLastMonitoringLinkmapQueryHandler(IMonitoringRepository monitoringRepository, ILinkmapGenerator linkmapGenerator)
    {
        _monitoringRepository = monitoringRepository;
        _linkmapGenerator = linkmapGenerator;
    }

    public async Task<byte[]?> Handle(GetLastMonitoringLinkmapQuery request, CancellationToken ct)
    {
        var sorBytes = await _monitoringRepository.GetLastMonitoringResultSor(request.MonitoringPortId, request.BaselineId, ct);
        if (sorBytes == null) return null;

        var lmapBytes = await _linkmapGenerator.GenerateLinkmap(new List<byte[]> { sorBytes }, request.MacrobendThreshold);
        return lmapBytes;
    }
}