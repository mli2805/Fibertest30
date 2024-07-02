namespace Fibertest30.Application;

public interface IDefaultPermissionProvider
{
    List<ApplicationPermission> AllPermissions { get; }
    IReadOnlyList<ApplicationDefaultRole> DefaultRoles { get; }

    List<ApplicationPermission> GetDefaultRolePermissions(ApplicationDefaultRole role);
}

public class DefaultPermissionProvider : IDefaultPermissionProvider
{
    public IReadOnlyList<ApplicationDefaultRole> DefaultRoles
        => Enum.GetValues<ApplicationDefaultRole>().ToList();

    public List<ApplicationPermission> AllPermissions
        => Enum.GetValues<ApplicationPermission>().ToList();

    public List<ApplicationPermission> GetDefaultRolePermissions(ApplicationDefaultRole role)
        => ApplicationDefaultPermissions.GetPermissionsByRole(role);
}
