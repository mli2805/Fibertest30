namespace Fibertest30.Application;

public class UserSettings
{
    public string UserId { get; set; } = null!;
    public string Theme { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string DateTimeFormat { get; set; } = string.Empty;
    public string LatLngFormat { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }

    public int Zoom { get; set; } = 16;
    public double Lat { get; set; } = 53.88;
    public double Lng { get; set; } = 27.51;

    public int ShowNodesFromZoom { get; set; } = 16;
    public int SourceMapId { get; set; } = 1;

    public bool SwitchOffSuspicionSignalling { get; set; } = false;
    public bool SwitchOffRtuStatusEventsSignalling { get; set; } = false;

}