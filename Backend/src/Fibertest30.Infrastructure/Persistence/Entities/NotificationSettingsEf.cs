using System.ComponentModel.DataAnnotations;

namespace Fibertest30.Infrastructure;
public class NotificationSettingsEf
{
    public int Id { get; init; }
    
    [MaxLength(255)]
    public string EmailServer { get; set; } = null!;
    
    [MaxLength(255)]
    public string TrapReceiver { get; set; } = null!;
}
