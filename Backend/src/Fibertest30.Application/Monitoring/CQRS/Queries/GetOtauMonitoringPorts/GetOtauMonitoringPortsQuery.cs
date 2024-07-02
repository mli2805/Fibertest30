using MediatR;

namespace Fibertest30.Application;

public record GetOtauMonitoringPortsQuery(int OtauId) : IRequest<List<MonitoringPort>>;

public class GetOtauMonitoringPortsQueryHandler : IRequestHandler<GetOtauMonitoringPortsQuery, List<MonitoringPort>>
{
    private readonly IMonitoringPortRepository _monitoringPortRepository;
    
    public GetOtauMonitoringPortsQueryHandler(IMonitoringPortRepository monitoringPortRepository)
    {
        _monitoringPortRepository = monitoringPortRepository;
    }

    public async Task<List<MonitoringPort>> Handle(GetOtauMonitoringPortsQuery request, CancellationToken ct)
    {
        var ports = await _monitoringPortRepository.GetOtauMonitoringPorts(request.OtauId, ct);
        return ports;
    }
}