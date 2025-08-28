
using Microsoft.AspNetCore.Identity;

namespace Fibertest30.Application;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;

    //public UserSettings? UserSettings { get; set; }

    public Guid ZoneId { get; set; } = Guid.Empty;
    public string? MachineKey { get; set; }

    public bool IsEmailEnabled { get; set; }
    public bool IsSmsEnabled { get; set; }


    public string GetFullName()
    {
        if (!string.IsNullOrEmpty(FirstName) && !string.IsNullOrEmpty(LastName)) {
            return $"{FirstName} {LastName}";
        } else if (!string.IsNullOrEmpty(FirstName)) {
           return FirstName;
        } else if (!string.IsNullOrEmpty(LastName)) {
           return LastName;
        } else {
            return UserName ?? string.Empty;
        }
    }
}
