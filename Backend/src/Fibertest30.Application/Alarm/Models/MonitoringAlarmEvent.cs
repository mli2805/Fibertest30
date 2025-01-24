namespace Fibertest30.Application;

public class MonitoringAlarmEvent : INotificationEvent
{
    public int Id { get; init; }
    public int MonitoringAlarmId { get; set; }
    public int MonitoringAlarmGroupId { get; init; }
    public int MonitoringPortId { get; set; }
    public int MonitoringResultId { get; set; }
    public MonitoringAlarmType Type { get; set; }
    public double? DistanceMeters { get; set; }
    public DateTime At { get; set; }
    public MonitoringAlarmStatus? OldStatus { get; set; }
    public MonitoringAlarmStatus Status { get; set; }
    public MonitoringAlarmLevel? OldLevel { get; set; }
    public MonitoringAlarmLevel Level { get; set; }
    public MonitoringChange? Change { get; init; }



}