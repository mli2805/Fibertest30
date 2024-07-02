using MediatR;

namespace Fibertest30.Application;

public record GetLastMonitoringQuery(int MonitoringPortId, int BaselineId) : IRequest<MonitoringResult?>;

public class GetLastMonitoringQueryHandler : IRequestHandler<GetLastMonitoringQuery, MonitoringResult?>
{
    private readonly IMonitoringRepository _monitoringRepository;

    public GetLastMonitoringQueryHandler(IMonitoringRepository monitoringRepository)
    {
        _monitoringRepository = monitoringRepository;
    }

    public async Task<MonitoringResult?> Handle(GetLastMonitoringQuery request, CancellationToken ct)
    {
        return await _monitoringRepository.GetLastMonitoringResult(request.MonitoringPortId, request.BaselineId, ct);
    }
}