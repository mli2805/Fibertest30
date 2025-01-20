using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Fibertest30.Infrastructure;

public class UsersRepository : IUsersRepository
{
    private static readonly string GetAllUsersKey = "GetAllUsers";

    private readonly ServerDbContext _serverDbContext;
    private readonly IUserRolePermissionProvider _permissionProvider;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IMemoryCache _cache;

    public UsersRepository(ServerDbContext serverDbContext,
        IUserRolePermissionProvider permissionProvider,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IMemoryCache cache
    )
    {
        _serverDbContext = serverDbContext;
        _permissionProvider = permissionProvider;
        _userManager = userManager;
        _roleManager = roleManager;
        _cache = cache;
    }

    public async Task<List<AuthenticatedUser>> GetAllUsers()
    {
        if (_cache.TryGetValue<List<AuthenticatedUser>>(GetAllUsersKey, out var cachedUsers))
        {
            return cachedUsers!;
        }

        var users = await DoGetAllUsers();
        _cache.Set(GetAllUsersKey, users);
        return users;
    }

    public async Task<AuthenticatedUser> GetUser(string userId)
    {
        // GetAllUsers is used instead of going to the database as users are cached here
        var allUsers = await GetAllUsers();
        return allUsers.Single(x => x.User.Id == userId);
    }
    
    public async Task<bool> IsUserExist(string userId)
    {
        var allUsers = await GetAllUsers();
        return allUsers.Any(x => x.User.Id == userId);
    }

    private async Task<List<AuthenticatedUser>> DoGetAllUsers()
    {
        var users = await _serverDbContext.Users.ToListAsync();
        var result = new List<AuthenticatedUser>();
        foreach (var user in users)
        {
            var role = await _permissionProvider.GetUserSingleRole(user);
            result.Add(new AuthenticatedUser(role, user));
        }

        return result;
    }

    public async Task UpdateUser(string userId, ApplicationUserPatch patch)
    {
        var existingUser = _serverDbContext.Users.FirstOrDefault(u => u.Id == userId);
        if (existingUser == null)
        {
            throw new NullReferenceException($"User {userId} not found");
        }

        await using var transaction = await _serverDbContext.Database.BeginTransactionAsync();

        try
        {
            PatchUser(existingUser, patch);
            await _serverDbContext.SaveChangesAsync();

            if (patch.Password is not null)
            {
                await ChangePassword(existingUser, patch.Password);
            }

            if (patch.Role is not null)
            {
                var adminRole = _serverDbContext.Roles.First(r => r.Name == ApplicationDefaultRole.Root.ToString());
                var admins = _serverDbContext.UserRoles.Where(u => u.RoleId == adminRole.Id).ToList();
                if (admins.Count() == 1 && admins[0].UserId == userId && patch.Role != ApplicationDefaultRole.Root.ToString())
                    throw new ArgumentException("Prohibited to downgrade last administrator");

                await ChangeRole(existingUser, patch.Role);
            }

            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }

        _cache.Remove(GetAllUsersKey);
    }

    public async Task DeleteUser(string userId)
    {
        var user = _serverDbContext.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            throw new NullReferenceException($"User {userId} not found");
        }

        await _userManager.DeleteAsync(user);
        _cache.Remove(GetAllUsersKey);
    }

    // later will accept MonitoringAlarmEvent and select Users to receive this event
    public async Task<List<AuthenticatedUser>> GetUsersToNotifyAboutAlarm()
    {
        return await GetAllUsers();
    }

    private void PatchUser(ApplicationUser user, ApplicationUserPatch patch)
    {
        if (patch.FirstName is not null)
        {
            user.FirstName = patch.FirstName;
        }

        if (patch.LastName is not null)
        {
            user.LastName = patch.LastName;
        }

        if (patch.Email is not null)
        {
            user.Email = patch.Email;
        }

        if (patch.JobTitle is not null)
        {
            user.JobTitle = patch.JobTitle;
        }

        if (patch.PhoneNumber is not null)
        {
            user.PhoneNumber = patch.PhoneNumber;
        }
    }

    private async Task ChangePassword(ApplicationUser user, string password)
    {
        if (password == string.Empty) { throw new ArgumentException("Password cannot be empty"); }

        var removePasswordResult = await _userManager.RemovePasswordAsync(user);
        if (!removePasswordResult.Succeeded)
        {
            throw new Exception($"Password for user {user.UserName} cant be changed");
        }

        var addPasswordResult = await _userManager.AddPasswordAsync(user, password);
        if (!addPasswordResult.Succeeded)
        {
            throw new Exception($"Password for user {user.UserName} cant be changed");
        }
    }

    private async Task ChangeRole(ApplicationUser user, string newRole)
    {
        var currentRole = await _permissionProvider.GetUserSingleRole(user);

        if (!await _roleManager.RoleExistsAsync(newRole))
        {
            throw new Exception($"Role {newRole} does not exist");
        }

        var removeRoleResult = await _userManager.RemoveFromRoleAsync(user, currentRole.Name);
        if (!removeRoleResult.Succeeded)
        {
            throw new Exception($"Could not remove user {user.UserName} from role {currentRole}");
        }

        var addToRoleResult = await _userManager.AddToRoleAsync(user, newRole);
        if (!addToRoleResult.Succeeded)
        {
            throw new Exception($"Could not add user {user.UserName} to role {newRole}");
        }
    }

    public async Task<string> CreateUser(ApplicationUserPatch patch)
    {
        var existingUser = _serverDbContext.Users.FirstOrDefault(u => u.UserName == patch.UserName);
        if (existingUser != null)
        {
            throw new NullReferenceException("UserName must be unique");
        }

        await using var transaction = await _serverDbContext.Database.BeginTransactionAsync();

        try
        {
            var newUser = PatchToUser(patch);
            var createResult = await _userManager.CreateAsync(newUser, patch.Password!);
            if (!createResult.Succeeded)
            {
                throw new Exception($"Could not create user {newUser.UserName}");

            }

            await _serverDbContext.SaveChangesAsync();

            var addToRoleResult = await _userManager.AddToRoleAsync(newUser, patch.Role!);
            if (!addToRoleResult.Succeeded)
            {
                throw new Exception($"Could not add user {newUser.UserName} to role {patch.Role!}");
            }

            await transaction.CommitAsync();
            _cache.Remove(GetAllUsersKey);
            return newUser.Id;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private ApplicationUser PatchToUser(ApplicationUserPatch patch)
    {
        return new ApplicationUser
        {
            Id = Guid.NewGuid().ToString(),
            UserName = patch.UserName!.ToLower(),
            FirstName = patch.FirstName!,
            LastName = patch.LastName!,
            Email = patch.Email!,
            PhoneNumber = patch.PhoneNumber ?? "",
            JobTitle = patch.JobTitle ?? "",
        };
    }

    // private ApplicationUser AddUser(ApplicationUserPatch patch)
    // {
    //     var newUser = new ApplicationUser()
    //     {
    //         Id = Guid.NewGuid().ToString(),
    //         UserName = patch.UserName!,
    //         FirstName = patch.FirstName!,
    //         LastName = patch.LastName!,
    //         Email = patch.Email!,
    //         PhoneNumber = patch.PhoneNumber ?? "",
    //         JobTitle = patch.JobTitle ?? "",
    //     };
    //     _serverDbContext.Users.Add(newUser);
    //     return newUser;
    // }
}
