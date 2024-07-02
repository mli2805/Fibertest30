using MediatR;

namespace Fibertest30.Application;

public record DismissAllUserAlarmNotificationsCommand() : IRequest<Unit>;

public class DismissAllUserAlarmNotificationsCommandHandler
    : IRequestHandler<DismissAllUserAlarmNotificationsCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;

    public DismissAllUserAlarmNotificationsCommandHandler(
        ICurrentUserService currentUserService,
        INotificationRepository notificationRepository)
    {
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
    }

    public async Task<Unit> Handle(DismissAllUserAlarmNotificationsCommand request,
        CancellationToken cancellationToken)
    {
        await _notificationRepository.DismissAllUserAlarmNotifications(
            _currentUserService.UserId!);
        
        return Unit.Value; 
    }
}