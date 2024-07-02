using MediatR;

namespace Fibertest30.Application;

public record GetUserAlarmNotificationsQuery() : IRequest<List<MonitoringAlarmEvent>>;

public class GetUserAlarmNotificationsQueryHandler 
    : IRequestHandler<GetUserAlarmNotificationsQuery, List<MonitoringAlarmEvent>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;

    public GetUserAlarmNotificationsQueryHandler(ICurrentUserService currentUserService, 
        INotificationRepository notificationRepository)
    {
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
    }

    public async Task<List<MonitoringAlarmEvent>> Handle(GetUserAlarmNotificationsQuery request, 
        CancellationToken cancellationToken)
    {
        return await _notificationRepository.GetUserAlarmNotifications(_currentUserService.UserId!);
    }
}