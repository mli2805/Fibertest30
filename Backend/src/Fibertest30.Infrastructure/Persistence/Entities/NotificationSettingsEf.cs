using System.ComponentModel.DataAnnotations;

namespace Fibertest30.Infrastructure;
public class NotificationSettingsEf
{
    public int Id { get; init; }
    
    // это json'ы со всеми настройками
    [MaxLength(2000)]
    public string EmailServer { get; set; } = null!;
    
    [MaxLength(2000)]
    public string TrapReceiver { get; set; } = null!;
}
