namespace Fibertest30.Application;


// The AllowCurrentUserChangingHimself attribute is used only with HasPermission attribute
// (if HasPermission is not set, every authenticated user is allowed)
// A Command or Query that use AllowCurrentUserChangingHimself must have a property named UserId of type string
// (this UserId is compared to current UserId)
[AttributeUsage(AttributeTargets.Class)]
public class AllowCurrentUserChangingHimselfAttribute : Attribute
{

}