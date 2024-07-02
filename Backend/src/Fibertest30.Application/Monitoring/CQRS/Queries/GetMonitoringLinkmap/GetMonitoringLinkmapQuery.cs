using MediatR;

namespace Fibertest30.Application;

public record GetMonitoringLinkmapQuery(int MonitoringId, double MacrobendThreshold) : IRequest<byte[]?>;

public class GetMonitoringLinkmapQueryHandler : IRequestHandler<GetMonitoringLinkmapQuery, byte[]?>
{
    private readonly IMonitoringRepository _monitoringRepository;
    private readonly ILinkmapGenerator _linkmapGenerator;
    
    public GetMonitoringLinkmapQueryHandler(IMonitoringRepository monitoringRepository, ILinkmapGenerator linkmapGenerator)
    {
        _monitoringRepository = monitoringRepository;
        _linkmapGenerator = linkmapGenerator;
    }

    public async Task<byte[]?> Handle(GetMonitoringLinkmapQuery request, CancellationToken ct)
    {
        var sorBytes = await _monitoringRepository.GetSor(request.MonitoringId);
        if (sorBytes == null) return null;

        var lmapBytes = await _linkmapGenerator.GenerateLinkmap(new List<byte[]> { sorBytes }, request.MacrobendThreshold);
        return lmapBytes;
    }
}