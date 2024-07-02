namespace Fibertest30.Application;

public record AuthenticatedUser(
    ApplicationRole Role,
    ApplicationUser User
);