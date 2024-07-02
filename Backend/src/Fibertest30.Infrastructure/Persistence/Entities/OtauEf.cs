namespace Fibertest30.Application;

public class OtauEf
{
    public int Id { get; set; }
    public OtauType Type { get; set; }
    public int OcmPortIndex { get; set; } 
    public int PortCount { get; set; }
    public string SerialNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Rack { get; set; } = string.Empty;
    public string Shelf { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public string JsonData { get; set; } = null!;
    
    public DateTime? OnlineAt { get; set; }
    public DateTime? OfflineAt { get; set; }
    public ICollection<OtauPortEf> Ports { get; set; } = null!;
}