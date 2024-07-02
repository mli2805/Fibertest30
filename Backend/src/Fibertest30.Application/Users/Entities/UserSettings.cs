namespace Fibertest30.Application;

public class UserSettings
{
    public string UserId { get; set; } = null!;
    public string Theme { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string DateTimeFormat { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; } 
}