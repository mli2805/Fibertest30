namespace Fibertest30.Infrastructure;

public class PortLabelEf
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string HexColor { get; set; } = string.Empty;
    public ICollection<MonitoringPortEf> MonitoringPorts { get; set; } = null!;
    public ICollection<PortLabelMonitoringPortEf> PortLabelMonitoringPorts { get; set; } = null!;
}

public class PortLabelMonitoringPortEf
{
    public int PortLabelId { get; set; }
    public int MonitoringPortId { get; set; }
    public PortLabelEf PortLabel { get; set; } = null!;
    public MonitoringPortEf MonitoringPort { get; set; } = null!;
}