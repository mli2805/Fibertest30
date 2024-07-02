namespace Fibertest30.Infrastructure.Persistence.Entities;
public class NotificationSettingsEf
{
    public int Id { get; init; }
    public string EmailServer { get; set; } = null!;
    public string TrapReceiver { get; set; } = null!;
}
