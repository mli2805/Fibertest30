using System.Reflection;

namespace Fibertest30.Application.UnitTests;

public static class PermissionTestExtensions
{
    public static void MustHavePermissionAttribute(this IEnumerable<Type> commands, ApplicationPermission permission)
    {
        foreach (var command in commands)
        {
            command.MustHavePermissionAttribute(permission);
        }
    }
    
    public static void MustHavePermissionAttribute(this Type command, ApplicationPermission permission)
    {
        var hasPermissionAttribute = command.GetCustomAttribute<HasPermissionAttribute>();
        hasPermissionAttribute.Should().NotBeNull();
        hasPermissionAttribute!.Permission.Should().Be(permission);
    }
}