namespace Fibertest30.Application;

public class UserAlarmNotificationEf
{
    public string UserId { get; set; } = null!;
    public int AlarmEventId { get; set; }

    public ApplicationUser User { get; set; } = null!;
    public MonitoringAlarmEventEf AlarmEvent { get; set; } = null!;
}