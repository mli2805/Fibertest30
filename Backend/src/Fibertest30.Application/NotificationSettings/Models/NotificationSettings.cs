namespace Fibertest30.Application;

public class NotificationSettings
{
    public int Id { get; init; }
    public EmailServer? EmailServer { get; set; }
    public TrapReceiver? TrapReceiver { get; set; }
}