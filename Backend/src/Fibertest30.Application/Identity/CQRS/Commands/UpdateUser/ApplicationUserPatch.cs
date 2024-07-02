namespace Fibertest30.Application;

// Do not change the names of properties as they are used in reflection.
public record ApplicationUserPatch
(
    string? UserName,
    string? FirstName,
    string? LastName,
    string? Email,
    string? PhoneNumber,
    string? JobTitle,
    string? Role,
    string? Password
    );
