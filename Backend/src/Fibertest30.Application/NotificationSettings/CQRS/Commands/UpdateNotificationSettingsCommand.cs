using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeNotificationSettings)]
public record UpdateNotificationSettingsCommand(NotificationSettings NotificationSettings) : IRequest<Unit>;

public class UpdateNotificationSettingsCommandHandler : IRequestHandler<UpdateNotificationSettingsCommand, Unit>
{
    private readonly INotificationSettingsRepository _notificationSettingsRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public UpdateNotificationSettingsCommandHandler(
        INotificationSettingsRepository notificationSettingsRepository,
        ISystemEventSender systemEventSender, ICurrentUserService currentUserService)
    {
        _notificationSettingsRepository = notificationSettingsRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateNotificationSettingsCommand request, CancellationToken cancellationToken)
    {
        await _notificationSettingsRepository.UpdateNotificationSettings(request.NotificationSettings,
            cancellationToken);

        var part = request.NotificationSettings.EmailServer == null ? "TrapReceiver" : "EmailServer";

        await _systemEventSender.Send(
            SystemEventFactory.NotificationSettingsUpdated(_currentUserService.UserId!, part));

        return Unit.Value;

    }
}
