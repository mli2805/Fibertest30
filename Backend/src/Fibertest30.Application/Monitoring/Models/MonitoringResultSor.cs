namespace Fibertest30.Application;

public class MonitoringResultSor
{
    public int Id { get; init; } 
    public byte[] Data { get; init; } = null!;
    
    public MeasurementSettings MeasurementSettings { get; init; } = null!;
    
    public List<MonitoringChange> Changes { get; init; } = null!;
}