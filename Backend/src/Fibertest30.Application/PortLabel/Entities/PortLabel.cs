namespace Fibertest30.Application;

public class PortLabel
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public string HexColor { get; init; } = null!;
    public List<int> MonitoringPortIds { get; init; } = null!;
}