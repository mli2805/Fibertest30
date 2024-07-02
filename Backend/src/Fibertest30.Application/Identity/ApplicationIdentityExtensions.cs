
using Microsoft.AspNetCore.Identity;

namespace Fibertest30.Application;

public static class ApplicationIdentityExtensions
{
    public static ApplicationDefaultRole ToApplicationDefaultRole(this IdentityRole role)
    {
        return role.Name!.ToApplicationDefaultRole();
    }

    public static ApplicationDefaultRole ToApplicationDefaultRole(this string role)
    {
        return Enum.Parse<ApplicationDefaultRole>(role);
    }

    public static ApplicationPermission ToApplicationPermission(this string permission)
    {
        return Enum.Parse<ApplicationPermission>(permission);
    }
}
