namespace Fibertest30.Application;

public interface INotificationRepository
{
    public bool IsEnabled(NotificationChannel channel, SystemEventType systemEventType, string userId);
    Task AddInAppSystemNotification(int systemEventId, string userId);
   
    Task<List<SystemEvent>> GetUserSystemNotifications(string userId);
    Task DismissUserSystemNotification(string userId, int systemEventId);
    Task DismissAllSystemNotificationsByLevel(string userId, SystemEventLevel systemEventLevel);
    Task DismissAllUserSystemNotifications(string userId);
}