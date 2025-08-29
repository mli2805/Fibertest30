namespace Fibertest30.Application;

public interface IUsersRepository
{
    Task<List<AuthenticatedUser>> GetAllUsers();
    Task<bool> IsUserExist(string userId);
    Task<AuthenticatedUser> GetUserById(string userId);
    Task<AuthenticatedUser?> GetUserByLogin(string login);
    Task<string> CreateUser(ApplicationUserPatch patch);
    Task UpdateUser(string userId, ApplicationUserPatch patch);
    Task DeleteUser(string userId);

    Task<List<AuthenticatedUser>> GetUsersToNotifyAboutAlarm();

}
