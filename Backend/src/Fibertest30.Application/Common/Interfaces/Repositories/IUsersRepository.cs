namespace Fibertest30.Application;

public interface IUsersRepository
{
    Task<List<AuthenticatedUser>> GetAllUsers();
    Task<bool> IsUserExist(string userId);
    Task<AuthenticatedUser> GetUser(string userId);
    Task<string> CreateUser(ApplicationUserPatch patch);
    Task UpdateUser(string userId, ApplicationUserPatch patch);
    Task DeleteUser(string userId);

    Task<List<AuthenticatedUser>> GetUsersToNotifyAboutAlarm();

}
