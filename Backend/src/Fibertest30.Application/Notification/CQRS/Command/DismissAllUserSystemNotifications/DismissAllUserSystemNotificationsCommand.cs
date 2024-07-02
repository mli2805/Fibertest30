using MediatR;

namespace Fibertest30.Application;

public record DismissAllUserSystemNotificationsCommand() : IRequest<Unit>;

public class DismissAllUserSystemNotificationsCommandHandler
    : IRequestHandler<DismissAllUserSystemNotificationsCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;

    public DismissAllUserSystemNotificationsCommandHandler(
        ICurrentUserService currentUserService,
        INotificationRepository notificationRepository)
    {
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
    }

    public async Task<Unit> Handle(DismissAllUserSystemNotificationsCommand request,
        CancellationToken cancellationToken)
    {
        await _notificationRepository.DismissAllUserSystemNotifications(
            _currentUserService.UserId!);
        
        return Unit.Value; 
    }
}