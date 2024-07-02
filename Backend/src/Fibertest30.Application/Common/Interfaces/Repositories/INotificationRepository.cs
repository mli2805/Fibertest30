namespace Fibertest30.Application;

public interface INotificationRepository
{
    public bool IsEnabled(NotificationChannel channel, SystemEventType systemEventType, string userId);
    Task AddInAppSystemNotification(int systemEventId, string userId);
    Task AddInAppAlarmNotification(int alarmEventId, string userId);
    Task<List<MonitoringAlarmEvent>> GetUserAlarmNotifications(string userId);
    Task DismissUserAlarmNotification(string userId, int alarmEventId);
    Task DismissAllAlarmNotificationsByLevel(string userId, MonitoringAlarmLevel alarmLevel);
    Task DismissAllUserAlarmNotifications(string userId);
    Task<List<SystemEvent>> GetUserSystemNotifications(string userId);
    Task DismissUserSystemNotification(string userId, int systemEventId);
    Task DismissAllSystemNotificationsByLevel(string userId, SystemEventLevel systemEventLevel);
    Task DismissAllUserSystemNotifications(string userId);
}