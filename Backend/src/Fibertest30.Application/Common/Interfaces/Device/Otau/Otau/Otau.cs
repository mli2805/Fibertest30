namespace Fibertest30.Application;

public class Otau
{
    public int Id { get; init; }
    public OtauType Type { get; init; }
    public int OcmPortIndex { get; init; } 
    public int PortCount { get; init; }
    public string SerialNumber { get; init; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Rack { get; set; } = string.Empty;
    public string Shelf { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    
    public DateTime? OnlineAt { get; set; }
    public DateTime? OfflineAt { get; init; }
    
    public IOtauParameters Parameters { get; init; } = null!;
    
    public List<OtauPort> Ports { get; init; } = null!;
}