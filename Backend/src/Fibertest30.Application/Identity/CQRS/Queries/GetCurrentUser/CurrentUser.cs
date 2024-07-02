namespace Fibertest30.Application;

public record CurrentUser(
    AuthenticatedUser AuthenticatedUser,
    UserSettings? UserSettings
);