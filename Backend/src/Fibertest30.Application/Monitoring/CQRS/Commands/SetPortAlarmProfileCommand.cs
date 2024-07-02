using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeMonitoringPortSettings)]
public record SetPortAlarmProfileCommand(int MonitoringPortId, int AlarmProfileId) : IRequest<Unit>;

public class SetPortAlarmProfileCommandHandler : IRequestHandler<SetPortAlarmProfileCommand, Unit>
{
    private readonly IMonitoringService _monitoringService;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public SetPortAlarmProfileCommandHandler(IMonitoringService monitoringService,
        ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _monitoringService = monitoringService;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(SetPortAlarmProfileCommand command, CancellationToken ct)
    {
        await _monitoringService.SetPortAlarmProfile(command.MonitoringPortId, command.AlarmProfileId, ct);

        await _systemEventSender.Send(
            SystemEventFactory.MonitoringPortAlarmProfileChanged(_currentUserService.UserId!, 
                command.MonitoringPortId, command.AlarmProfileId));

        return Unit.Value;
    }
}