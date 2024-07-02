namespace Fibertest30.Application;

public record AuthenticationResult(
    bool Allow, 
    string Token,
    AuthenticatedUser? User,
    UserSettings? UserSettings
);