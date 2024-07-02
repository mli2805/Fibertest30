namespace Fibertest30.Application;

public class MonitoringAlarm
{
    public int Id { get; set; }
    public int AlarmGroupId { get; set; }
    public int MonitoringPortId { get; init; }
    public int MonitoringResultId { get; init; }
    public DateTime LastChangedAt { get; set; }
    public DateTime ActiveAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public MonitoringAlarmType Type { get; init; }
    public MonitoringAlarmLevel Level { get; set; }
    public MonitoringAlarmStatus Status { get; set; }
    public double? DistanceMeters { get; set; }
    
    public List<MonitoringAlarmEvent>? Events { get; set; }
}
