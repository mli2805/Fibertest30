using MediatR;

namespace Fibertest30.Application;

public record DismissUserAlarmNotificationsByLevelCommand(MonitoringAlarmLevel AlarmLevel) : IRequest<Unit>;

public class DismissUserAlarmNotificationsByLevelCommandHandler 
    : IRequestHandler<DismissUserAlarmNotificationsByLevelCommand,
        Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;

    public DismissUserAlarmNotificationsByLevelCommandHandler(
        ICurrentUserService currentUserService,
        INotificationRepository notificationRepository)
    {
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
    }

    public async Task<Unit> Handle(DismissUserAlarmNotificationsByLevelCommand request,
        CancellationToken cancellationToken)
    {
        await _notificationRepository.DismissAllAlarmNotificationsByLevel(
            _currentUserService.UserId!,
            request.AlarmLevel);
        
        return Unit.Value; 
    }
}