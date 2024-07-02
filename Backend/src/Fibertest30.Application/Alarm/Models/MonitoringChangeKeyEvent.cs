namespace Fibertest30.Application;

public class MonitoringChangeKeyEvent
{
    public int KeyEventIndex { get; set; }
    
    public double? DistanceMeters { get; set; }
    public double? EventLoss { get; set; }
    public QualifiedValue? EventReflectance { get; set; } = null!;
    public double? SectionAttenuation { get; set; }
    public bool? IsClipped { get; set; }
    public bool? IsReflective { get; set; }
    public string Comment { get; set; } = null!;
}