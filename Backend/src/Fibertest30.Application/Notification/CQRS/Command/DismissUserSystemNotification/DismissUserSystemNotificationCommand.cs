using MediatR;

namespace Fibertest30.Application;

public record DismissUserSystemNotificationCommand(int SystemEventId) : IRequest<Unit>;

public class DismissUserSystemNotificationCommandHandler 
    : IRequestHandler<DismissUserSystemNotificationCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;

    public DismissUserSystemNotificationCommandHandler(
        ICurrentUserService currentUserService,
        INotificationRepository notificationRepository)
    {
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
    }

    public async Task<Unit> Handle(DismissUserSystemNotificationCommand request,
        CancellationToken cancellationToken)
    {
        await _notificationRepository.DismissUserSystemNotification(
            _currentUserService.UserId!,
            request.SystemEventId);
        
        return Unit.Value; 
    }
}