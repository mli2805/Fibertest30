namespace Fibertest30.HtmlTemplates;

public class MonitoringAlarmEventViewModel
{
    public string At { get; set; } = null!;
    public string? OldLevel { get; set; }
    public string? OldLevelValue { get; set; }
    public string Level { get; set; } = null!;
    public string LevelValue { get; set; } = null!;
    public string? OldStatus { get; set; }
    public string? OldStatusValue { get; set; }
    public string Status { get; set; } = null!;
    
    public string EvenOrOdd { get; set; } = null!;
    public string StatusColor { get; set; } = null!;
}