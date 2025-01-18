using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class UserSettingsRepository : IUserSettingsRepository
{
    private readonly RtuContext _rtuContext;

    public UserSettingsRepository(RtuContext rtuContext)
    {
        _rtuContext = rtuContext;
    }
    
    public Task<UserSettings?> GetUserSettings(string userId)
    {
        return _rtuContext.UserSettings
            .SingleOrDefaultAsync(x => x.UserId == userId);
    }

    public async Task SaveUserSettings(string userId, UserSettings settings)
    {
        var userSettings = _rtuContext.UserSettings.SingleOrDefault(x => x.UserId == userId);
        if (userSettings == null)
        {
            settings.UserId = userId;
            _rtuContext.UserSettings.Add(settings);
        }
        else
        {
            userSettings.Theme = settings.Theme;
            userSettings.Language = settings.Language;
            userSettings.DateTimeFormat = settings.DateTimeFormat;
            userSettings.Zoom = settings.Zoom;
            userSettings.Lat = settings.Lat;
            userSettings.Lng = settings.Lng;
        }
        
        await _rtuContext.SaveChangesAsync();
    }
}