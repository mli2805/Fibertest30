namespace Fibertest30.Application;

public class OtauPort
{
    public int Id { get; init; }
    public int OtauId { get; init; }
    public int PortIndex { get; init; }
    public bool Unavailable { get; init; }
    
    public int MonitoringPortId { get; init; }
}