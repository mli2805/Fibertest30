namespace Fibertest30.Application;

public class OtauPortEf
{
    public int Id { get; set; }
    public int OtauId { get; set; } 
    public int MonitoringPortId { get; set; }
    public int PortIndex { get; set; }
    public bool Unavailable { get; set; }
    public OtauEf Otau { get; set; } = null!;
    public MonitoringPortEf MonitoringPort { get; set; } = null!;
}