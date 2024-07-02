namespace Fibertest30.Application;

public class UserSystemNotificationEf
{
    public string UserId { get; set; } = null!;
    public int SystemEventId { get; set; }

    public ApplicationUser User { get; set; } = null!;
    public SystemEventEf SystemEvent { get; set; } = null!;
}