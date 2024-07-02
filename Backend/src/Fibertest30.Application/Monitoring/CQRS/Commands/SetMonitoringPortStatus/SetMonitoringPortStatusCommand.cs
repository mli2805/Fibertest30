using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeMonitoringPortSettings)]
public record SetMonitoringPortStatusCommand(int MonitoringPortId, MonitoringPortStatus Status) : IRequest<Unit>;

public class SetMonitoringPortStatusCommandHandler : IRequestHandler<SetMonitoringPortStatusCommand, Unit>
{
    private readonly IMonitoringService _monitoringService;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public SetMonitoringPortStatusCommandHandler(IMonitoringService monitoringService, 
        ISystemEventSender systemEventSender, 
        ICurrentUserService currentUserService)
    {
        _monitoringService = monitoringService;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(SetMonitoringPortStatusCommand request, CancellationToken ct)
    {
        await _monitoringService.SetMonitoringPortStatus(request.MonitoringPortId, request.Status, ct);
        
        await _systemEventSender.Send(
            SystemEventFactory.MonitoringPortStatusChanged
                (_currentUserService.UserId!, request.MonitoringPortId, request.Status));
        
        return Unit.Value;
    }
}