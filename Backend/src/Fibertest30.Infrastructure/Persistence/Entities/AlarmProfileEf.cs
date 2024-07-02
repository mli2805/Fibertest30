namespace Fibertest30.Application;

public class AlarmProfileEf
{
    public int Id { get; init; }
    public string Name { get; set; } = null!;

    public ICollection<ThresholdEf> Thresholds { get; set; } = null!;
    public ICollection<MonitoringPortEf> MonitoringPorts { get; set; } = null!;
}