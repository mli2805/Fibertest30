using MediatR;

namespace Fibertest30.Application;

public record GetAlarmQuery(int Id) : IRequest<MonitoringAlarm>;

public class GetAlarmQueryHandler : IRequestHandler<GetAlarmQuery, MonitoringAlarm>
{
    private readonly IMonitoringAlarmRepository _monitoringAlarmRepository;

    public GetAlarmQueryHandler(IMonitoringAlarmRepository monitoringAlarmRepository)
    {
        _monitoringAlarmRepository = monitoringAlarmRepository;
    }

    public async Task<MonitoringAlarm> Handle(GetAlarmQuery request, CancellationToken ct)
    {
        return await _monitoringAlarmRepository.GetAlarmWithEvents(request.Id, null, ct);
    }
}