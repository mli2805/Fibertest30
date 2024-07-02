using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class NotificationRepository : INotificationRepository
{
    private readonly RtuContext _rtuContext;

    public NotificationRepository(RtuContext rtuContext)
    {
        _rtuContext = rtuContext;
    }
    
    public bool IsEnabled(NotificationChannel channel, SystemEventType systemEventType, string userId)
    {
        // read from some settings in database
        // cache the settings in memory! It must work fast!
        
        return true;
    }

    public async Task AddInAppSystemNotification(int systemEventId, string userId)
    {
        _rtuContext.UserSystemNotifications.Add(new UserSystemNotificationEf
        {
            UserId = userId,
            SystemEventId =  systemEventId
        });
        
        await _rtuContext.SaveChangesAsync();
    }

    public async Task AddInAppAlarmNotification(int alarmEventId, string userId)
    {
        var alarmNotification = new UserAlarmNotificationEf()
        {
            UserId = userId, AlarmEventId = alarmEventId
        };

        _rtuContext.UserAlarmNotifications.Add(alarmNotification);
        await _rtuContext.SaveChangesAsync();
    }
    
    public async Task<List<MonitoringAlarmEvent>> GetUserAlarmNotifications(string userId)
    {
        return await _rtuContext.UserAlarmNotifications
            .Where(x => x.UserId == userId)
            .Include(x => x.AlarmEvent)
            .Select(x => x.AlarmEvent.FromEf())
            .ToListAsync();
    }
    
    public async Task DismissUserAlarmNotification(string userId, int alarmEventId)
    {
        var notification = new UserAlarmNotificationEf
        {
            UserId = userId,
            AlarmEventId = alarmEventId
        };

        _rtuContext.UserAlarmNotifications.Attach(notification);
        _rtuContext.UserAlarmNotifications.Remove(notification);

        await _rtuContext.SaveChangesAsync();
    }
    
    public async Task DismissAllAlarmNotificationsByLevel(string userId, MonitoringAlarmLevel alarmLevel)
    {
        await _rtuContext.UserAlarmNotifications
            .Where(x => x.UserId == userId && x.AlarmEvent.Level == alarmLevel)
            .ExecuteDeleteAsync();
    }
    
    public async Task  DismissAllUserAlarmNotifications(string userId)
    {
        await _rtuContext.UserAlarmNotifications
            .Where(x => x.UserId == userId)
            .ExecuteDeleteAsync();
    }

    public async Task<List<SystemEvent>> GetUserSystemNotifications(string userId)
    {
        return await _rtuContext.UserSystemNotifications
            .Where(x => x.UserId == userId)
            .Include(x => x.SystemEvent)
            .Select(x => x.SystemEvent.FromEf())
            .ToListAsync();
    }

    public async Task DismissUserSystemNotification(string userId, int systemEventId)
    {
        var notification = new UserSystemNotificationEf
        {
            UserId = userId,
            SystemEventId = systemEventId
        };

        _rtuContext.UserSystemNotifications.Attach(notification);
        _rtuContext.UserSystemNotifications.Remove(notification);

        await _rtuContext.SaveChangesAsync();
    }
    
    public async Task DismissAllSystemNotificationsByLevel(string userId, SystemEventLevel systemEventLevel)
    {
        await _rtuContext.UserSystemNotifications
            .Where(x => x.UserId == userId && x.SystemEvent.Level == systemEventLevel)
            .ExecuteDeleteAsync();
    }

    public async Task  DismissAllUserSystemNotifications(string userId)
    {
        await _rtuContext.UserSystemNotifications
            .Where(x => x.UserId == userId)
            .ExecuteDeleteAsync();
    }
}