
namespace Fibertest30.Application;

[AttributeUsage(AttributeTargets.Class)]
public class HasPermissionAttribute : Attribute
{
    public HasPermissionAttribute(ApplicationPermission permission)
    {
        Permission = permission;
    }

    public ApplicationPermission Permission { get; init; }
}

