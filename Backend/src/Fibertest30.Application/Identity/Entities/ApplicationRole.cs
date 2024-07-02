namespace Fibertest30.Application;

// NOTE: This class is not like ApplicationUser, it is not used as EF entity 
public record ApplicationRole (
    string Name,
    List<ApplicationPermission> Permissions
);