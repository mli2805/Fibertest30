using System.ComponentModel.DataAnnotations;

namespace Fibertest30.Infrastructure;

public class UserSystemNotificationEf
{
    [MaxLength(100)]
    public string UserId { get; set; } = null!;
    public int SystemEventId { get; set; }

    public ApplicationUser User { get; set; } = null!;
    public SystemEventEf SystemEvent { get; set; } = null!;
}