using MediatR;

namespace Fibertest30.Application;

public record GetActiveAlarmsQuery() : IRequest<List<MonitoringAlarm>>;

public class GetActiveAlarmsQueryHandler : IRequestHandler<GetActiveAlarmsQuery, List<MonitoringAlarm>>
{
    private readonly IMonitoringAlarmRepository _monitoringAlarmRepository;

    public GetActiveAlarmsQueryHandler(IMonitoringAlarmRepository monitoringAlarmRepository)
    {
        _monitoringAlarmRepository = monitoringAlarmRepository;
    }


    public async Task<List<MonitoringAlarm>> Handle(GetActiveAlarmsQuery request, CancellationToken ct)
    {
        return await _monitoringAlarmRepository.GetAllActiveAlarms(includeEvents: true, ct);
    }
}