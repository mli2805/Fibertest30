namespace Fibertest30.Application;

public class MonitoringChange
{
    public MonitoringAlarmType Type { get; init; }
    public MonitoringAlarmLevel Level { get; init; }
    public double? DistanceMeters { get; set; }
    // DistanceThresholdMeters is always set when DistanceMeters is set
    public double? DistanceThresholdMeters { get; init; }
    
    public double? Threshold { get; set; }
    public double? ThresholdExcessDelta { get; set; }
    public ValueExactness? ReflectanceExcessDeltaExactness { get; set; }
    
    public MonitoringChangeKeyEvent? Current { get; set; }
    public MonitoringChangeKeyEvent? Baseline { get; set; }
    public MonitoringChangeKeyEvent? BaselineLeft { get; set; }
    public MonitoringChangeKeyEvent? BaselineRight { get; set; }
}