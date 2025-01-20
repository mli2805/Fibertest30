using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class NotificationRepository : INotificationRepository
{
    private readonly ServerDbContext _serverDbContext;

    public NotificationRepository(ServerDbContext serverDbContext)
    {
        _serverDbContext = serverDbContext;
    }
    
    public bool IsEnabled(NotificationChannel channel, SystemEventType systemEventType, string userId)
    {
        // read from some settings in database
        // cache the settings in memory! It must work fast!
        
        return true;
    }

    public async Task AddInAppSystemNotification(int systemEventId, string userId)
    {
        _serverDbContext.UserSystemNotifications.Add(new UserSystemNotificationEf
        {
            UserId = userId,
            SystemEventId =  systemEventId
        });
        
        await _serverDbContext.SaveChangesAsync();
    }

  
    public async Task<List<SystemEvent>> GetUserSystemNotifications(string userId)
    {
        return await _serverDbContext.UserSystemNotifications
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

        _serverDbContext.UserSystemNotifications.Attach(notification);
        _serverDbContext.UserSystemNotifications.Remove(notification);

        await _serverDbContext.SaveChangesAsync();
    }
    
    public async Task DismissAllSystemNotificationsByLevel(string userId, SystemEventLevel systemEventLevel)
    {
        await _serverDbContext.UserSystemNotifications
            .Where(x => x.UserId == userId && x.SystemEvent.Level == systemEventLevel)
            .ExecuteDeleteAsync();
    }

    public async Task  DismissAllUserSystemNotifications(string userId)
    {
        await _serverDbContext.UserSystemNotifications
            .Where(x => x.UserId == userId)
            .ExecuteDeleteAsync();
    }
}