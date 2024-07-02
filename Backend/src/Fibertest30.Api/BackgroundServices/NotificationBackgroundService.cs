namespace Fibertest30.Api;

public class NotificationBackgroundService : BackgroundService
{
    private readonly INotificationDispatcher _notificationDispatcher;
    
    public NotificationBackgroundService(INotificationDispatcher notificationDispatcher)
    {
        _notificationDispatcher = notificationDispatcher;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _notificationDispatcher.ProcessNotifications(stoppingToken);
    }
}