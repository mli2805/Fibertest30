namespace Fibertest30.Application;

public interface IUserSettingsRepository
{
    Task<UserSettings?> GetUserSettings(string userId);
    Task SaveUserSettings(string userId, UserSettings settings);
}