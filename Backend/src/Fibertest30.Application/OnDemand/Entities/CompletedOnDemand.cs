namespace Fibertest30.Application;

public class CompletedOnDemand
{
    public string Id { get; init; } = string.Empty;
    public string CreatedByUserId { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public DateTime StartedAt { get; init; }
    public DateTime CompletedAt { get; init; }
    public int MonitoringPortId { get; init; }
    public MeasurementSettings MeasurementSettings { get; init; } = null!;
    public CompletedOnDemandSor? Sor { get; init; }
}