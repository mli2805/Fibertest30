using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeMonitoringPortSettings)]
public record SetMonitoringPortScheduleCommand(int MonitoringPortId, MonitoringSchedulerMode Mode,
    TimeSpan Interval, List<int> TimeSlotIds) : IRequest<Unit>;

public class SetMonitoringPortScheduleCommandHandler : IRequestHandler<SetMonitoringPortScheduleCommand, Unit>
{
    private readonly IMonitoringService _monitoringService;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public SetMonitoringPortScheduleCommandHandler(IMonitoringService monitoringService,
        ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _monitoringService = monitoringService;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(SetMonitoringPortScheduleCommand command, CancellationToken ct)
    {
        await _monitoringService.SetMonitoringPortSchedule(command.MonitoringPortId,
            command.Mode, command.Interval, command.TimeSlotIds, ct);

        await _systemEventSender.Send(
            SystemEventFactory.MonitoringPortScheduleChanged
                (_currentUserService.UserId!, command.MonitoringPortId, command.Mode, command.Interval, command.TimeSlotIds));


        return Unit.Value;
    }
}
