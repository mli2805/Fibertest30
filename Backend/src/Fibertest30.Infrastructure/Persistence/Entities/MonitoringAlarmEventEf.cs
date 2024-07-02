namespace Fibertest30.Application;

public class MonitoringAlarmEventEf
{
    public int Id { get; set; }
    public int MonitoringPortId { get; set; }
    public int MonitoringAlarmId { get; set; }
    public int MonitoringAlarmGroupId { get; set; }
    public int MonitoringResultId { get; set; }
    public MonitoringAlarmType Type { get; init; }
    public double? DistanceMeters { get; set; }
    public DateTime At { get; set; }
    public MonitoringAlarmStatus? OldStatus { get; set; }
    public MonitoringAlarmStatus Status { get; set; }
    public MonitoringAlarmLevel? OldLevel { get; set; }
    public MonitoringAlarmLevel Level { get; set; }
    public MonitoringChange? Change { get; init; }

    public MonitoringAlarmEf Alarm { get; set; } = null!;
    public MonitoringResult MonitoringResult { get; set; } = null!;
    public MonitoringPortEf MonitoringPort { get; set; } = null!;
}