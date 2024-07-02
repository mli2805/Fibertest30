namespace Fibertest30.Application;

public class MonitoringBaselineEf
{
    public int Id {  get; init; }
    public int MonitoringPortId { get; set; }
    public string CreatedByUserId { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public MeasurementSettings MeasurementSettings { get; init; } = null!;
    public MonitoringBaselineSorEf? Sor { get; set; }
}

public class MonitoringBaselineSorEf
{
    public int Id { get; init; }
    public byte[] Data { get; init; } = null!;
}