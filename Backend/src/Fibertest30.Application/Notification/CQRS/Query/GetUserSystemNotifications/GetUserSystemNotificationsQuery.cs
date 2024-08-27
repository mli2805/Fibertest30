using MediatR;

namespace Fibertest30.Application;

public record GetUserSystemNotificationsQuery : IRequest<List<SystemEvent>>;

public class GetUserSystemNotificationsQueryHandler : IRequestHandler<GetUserSystemNotificationsQuery, List<SystemEvent>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;

    public GetUserSystemNotificationsQueryHandler(ICurrentUserService currentUserService, 
        INotificationRepository notificationRepository)
    {
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
    }

    public async Task<List<SystemEvent>> Handle(GetUserSystemNotificationsQuery request, CancellationToken cancellationToken)
    {
        return await _notificationRepository.GetUserSystemNotifications(_currentUserService.UserId!);
    }
}