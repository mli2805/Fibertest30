namespace Fibertest30.Application;

public class MonitoringResult
{
    public int Id { get; init; } 
    public int MonitoringPortId { get; init; }
    public int BaselineId { get; init; }
    public long CompletedAt { get; init; }
    public MonitoringResultSor? Sor { get; init; }
    public int ChangesCount { get; init; }
    public MonitoringAlarmLevel? MostSevereChangeLevel { get; init; }
  
    // MeasurementSettings & Changes are filled only when user request monitoring details, i.e. calls GetMonitoring(addExtra: true)F
    public MeasurementSettings? MeasurementSettings { get; set; } 
    
    public List<MonitoringChange>? Changes { get; set; }
}



