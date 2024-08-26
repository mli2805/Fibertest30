using MediatR;

namespace Fibertest30.Application;
public record DismissUserSystemNotificationsByLevelCommand(SystemEventLevel SystemEventLevel) : IRequest<Unit>;

public class DismissUserSystemNotificationsByLevelCommandHandler 
    : IRequestHandler<DismissUserSystemNotificationsByLevelCommand,
        Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;

    public DismissUserSystemNotificationsByLevelCommandHandler(
        ICurrentUserService currentUserService,
        INotificationRepository notificationRepository)
    {
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
    }

    public async Task<Unit> Handle(DismissUserSystemNotificationsByLevelCommand request,
        CancellationToken cancellationToken)
    {
        await _notificationRepository.DismissAllSystemNotificationsByLevel(
            _currentUserService.UserId!,
            request.SystemEventLevel);
        
        return Unit.Value; 
    }
}
