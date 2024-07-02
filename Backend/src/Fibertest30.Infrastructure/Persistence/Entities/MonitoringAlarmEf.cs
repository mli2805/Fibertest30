namespace Fibertest30.Application;

public class MonitoringAlarmEf
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
    
    public MonitoringChange? Change { get; init; }
    
    public MonitoringPortEf? MonitoringPort { get; set; }
    public MonitoringResult? MonitoringResult { get; set; }
    public List<MonitoringAlarmEventEf>? Events { get; set; }
}