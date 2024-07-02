using MediatR;

namespace Fibertest30.Application;

public record GetMonitoringPortQuery(int MonitoringPortId) : IRequest<MonitoringPort>;

public class GetMonitoringPortQueryHandler : IRequestHandler<GetMonitoringPortQuery, MonitoringPort>
{
    private readonly IMonitoringPortRepository _monitoringPortRepository;

    public GetMonitoringPortQueryHandler(IMonitoringPortRepository monitoringPortRepository)
    {
        _monitoringPortRepository = monitoringPortRepository;
    }

    public async Task<MonitoringPort> Handle(GetMonitoringPortQuery request, CancellationToken ct)
    {
        var port = await _monitoringPortRepository.GetMonitoringPort(request.MonitoringPortId, ct);
        return port;
    }
}