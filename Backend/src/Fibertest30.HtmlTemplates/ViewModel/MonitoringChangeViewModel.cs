namespace Fibertest30.HtmlTemplates;

public class MonitoringChangeViewModel
{
    public bool ShowDistances { get; set; }
    public string BaselineLeftDeltaDistance { get; set; } = null!;
    public string BaselineRightDeltaDistance { get; set; } = null!;
    public string BaselineLeftComment { get; set; } = null!;
    public string BaselineRightComment { get; set; } = null!;
}