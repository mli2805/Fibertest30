
using Microsoft.AspNetCore.Identity;

namespace Fibertest30.Application;

public interface IUserRolePermissionProvider
{
    Task<ApplicationRole> GetUserSingleRole(ApplicationUser user);
    Task<List<ApplicationPermission>> GetUserPermissions(ApplicationUser user);
    Task<List<ApplicationPermission>> GetRolePermissions(string roleName);
    Task<bool> HasPermission(string role, ApplicationPermission permission);
    Task<List<ApplicationRole>> GetAllRoles();
}

public class UserRolePermissionProvider : IUserRolePermissionProvider
{
    private readonly IDefaultPermissionProvider _defaultPermissionProvider;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public UserRolePermissionProvider(
        IDefaultPermissionProvider defaultPermissionProvider,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _defaultPermissionProvider = defaultPermissionProvider;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<ApplicationRole> GetUserSingleRole(ApplicationUser user)
    {
        var userRoles = await _userManager.GetRolesAsync(user);
        if (userRoles.Count != 1) { throw new Exception($"User={user.UserName} must have only a single role"); }

        var roleName = userRoles[0];
        var permissions = await GetRolePermissions(roleName);
        return new ApplicationRole(roleName, permissions);
    }

    public async Task<List<ApplicationPermission>> GetUserPermissions(ApplicationUser user)
    {
        var userSingleRole = await GetUserSingleRole(user);
        var permissions = await GetRolePermissions(userSingleRole.Name);
        return permissions;
    }

    public async Task<List<ApplicationPermission>> GetRolePermissions(string roleName)
    {
        var isUserHasDefaultRole = _defaultPermissionProvider.DefaultRoles.Any(x => x.ToString() == roleName);

        if (isUserHasDefaultRole)
        {
            var defaultRolePermissions = _defaultPermissionProvider.GetDefaultRolePermissions(roleName.ToApplicationDefaultRole());
            return defaultRolePermissions;
        }

        // In case of a custom role, we hit the database and get custom role's permission claims

        // TODO:
        // As this is also intended to be called on each request (to get permissions based on a role name)
        // we should cache permissions and introduce some invalidate cache logic
        // (for example invalidate if custom role is changed by Administrator)

        var userRole = await _roleManager.FindByNameAsync(roleName);
        if (userRole is null) { throw new Exception($"Can't find role={roleName}"); }

        var roleClaims = await _roleManager.GetClaimsAsync(userRole);
        return roleClaims.Where(x => x.Type == ApplicationClaims.Permissions)
            .Select(x => x.Value.ToApplicationPermission()).ToList();
    }

    public async Task<bool> HasPermission(string role, ApplicationPermission permission)
    {
        var permissions = await this.GetRolePermissions(role);
        return permissions.Any(x => x == permission);
    }

    public async Task<List<ApplicationRole>> GetAllRoles()
    {
        // Currently we return only default roles
        // When we introduce custom roles, we should return them as well

        var roleNames = _defaultPermissionProvider.DefaultRoles.Select(x => x.ToString()).ToList();

        var roles = await Task.WhenAll(roleNames.Select(async roleName =>
            new ApplicationRole(roleName, await GetRolePermissions(roleName))));

        return roles.ToList();
    }
}
