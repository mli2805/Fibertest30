namespace Fibertest30.Application;

public class MonitoringBaseline
{
    public int Id { get; init; }
    
    public int MonitoringPortId { get; set; }
    public string CreatedByUserId { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public MeasurementSettings MeasurementSettings { get; init; } = null!;
}