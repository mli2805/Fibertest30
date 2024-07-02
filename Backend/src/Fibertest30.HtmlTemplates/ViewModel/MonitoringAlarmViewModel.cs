namespace Fibertest30.HtmlTemplates;

public class MonitoringAlarmViewModel
{
    public int Id { get; set; }
    public int GroupId { get; set; }
    public string Type { get; set; } = null!;
    public string Distance { get; set; } = null!;
    public string Level { get; set; } = null!;
    public string LevelValue { get; set; }  = null!; // lower-cased, non-translated
    public string Status { get; set; } = null!;
    public List<MonitoringAlarmEventViewModel> Events { get; set; } = null!;
    
    public string LevelColor { get; set; } = null!;
    public string StatusColor { get; set; } = null!;

    public MonitoringChangeViewModel  Change { get; set; } = null!;
}