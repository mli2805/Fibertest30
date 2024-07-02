using MediatR;

namespace Fibertest30.Application;

public record GetAlarmEventsQuery(List<int> PortIds) : IRequest<List<MonitoringAlarmEvent>>;

public class GetAlarmEventsQueryHandler : IRequestHandler<GetAlarmEventsQuery, List<MonitoringAlarmEvent>>
{
    private readonly IAlarmEventRepository _alarmEventRepository;

    public GetAlarmEventsQueryHandler(IAlarmEventRepository alarmEventRepository)
    {
        _alarmEventRepository = alarmEventRepository;
    }

    public async Task<List<MonitoringAlarmEvent>> Handle(GetAlarmEventsQuery request, CancellationToken cancellationToken)
    {
        return await _alarmEventRepository.GetFilteredPortion(request.PortIds, sortDescending: true);
    }
}
