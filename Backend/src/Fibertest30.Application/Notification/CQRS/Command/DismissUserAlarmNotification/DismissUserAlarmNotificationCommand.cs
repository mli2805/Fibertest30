using MediatR;

namespace Fibertest30.Application;

public record DismissUserAlarmNotificationCommand(int AlarmEventId) : IRequest<Unit>;

public class DismissUserAlarmNotificationCommandHandler 
    : IRequestHandler<DismissUserAlarmNotificationCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationRepository _notificationRepository;

    public DismissUserAlarmNotificationCommandHandler(
        ICurrentUserService currentUserService,
        INotificationRepository notificationRepository)
    {
        _currentUserService = currentUserService;
        _notificationRepository = notificationRepository;
    }

    public async Task<Unit> Handle(DismissUserAlarmNotificationCommand request,
        CancellationToken cancellationToken)
    {
        await _notificationRepository.DismissUserAlarmNotification(
            _currentUserService.UserId!,
            request.AlarmEventId);
        
        return Unit.Value; 
    }
}