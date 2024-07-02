using MediatR;

namespace Fibertest30.Application;

public record GetAllAlarmsQuery(List<int> PortIds) : IRequest<List<MonitoringAlarm>>;

public class GetAllAlarmsQueryHandler : IRequestHandler<GetAllAlarmsQuery, List<MonitoringAlarm>>
{
    private readonly IMonitoringAlarmRepository _monitoringAlarmRepository;

    public GetAllAlarmsQueryHandler(IMonitoringAlarmRepository monitoringAlarmRepository)
    {
        _monitoringAlarmRepository = monitoringAlarmRepository;
    }

    public async Task<List<MonitoringAlarm>> Handle(GetAllAlarmsQuery request, CancellationToken cancellationToken)
    {
        return await _monitoringAlarmRepository.GetAllAlarms(request.PortIds, true, cancellationToken);
    }
}