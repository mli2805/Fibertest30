using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class UserSettingsRepository : IUserSettingsRepository
{
    private readonly ServerDbContext _serverDbContext;

    public UserSettingsRepository(ServerDbContext serverDbContext)
    {
        _serverDbContext = serverDbContext;
    }
    
    public Task<UserSettings?> GetUserSettings(string userId)
    {
        return _serverDbContext.UserSettings
            .SingleOrDefaultAsync(x => x.UserId == userId);
    }

    public async Task SaveUserSettings(string userId, UserSettings settings)
    {
        var userSettings = _serverDbContext.UserSettings.SingleOrDefault(x => x.UserId == userId);
        if (userSettings == null)
        {
            settings.UserId = userId;
            _serverDbContext.UserSettings.Add(settings);
        }
        else
        {
            userSettings.Theme = settings.Theme;
            userSettings.Language = settings.Language;
            userSettings.DateTimeFormat = settings.DateTimeFormat;
            userSettings.LatLngFormat = settings.LatLngFormat;
            userSettings.Zoom = settings.Zoom;
            userSettings.Lat = settings.Lat;
            userSettings.Lng = settings.Lng;
            userSettings.ShowNodesFromZoom = settings.ShowNodesFromZoom;
            userSettings.SourceMapId = settings.SourceMapId;
            userSettings.SwitchOffSuspicionSignalling = settings.SwitchOffSuspicionSignalling;
            userSettings.SwitchOffRtuStatusEventsSignalling = settings.SwitchOffRtuStatusEventsSignalling;
        }
        
        await _serverDbContext.SaveChangesAsync();
    }
}