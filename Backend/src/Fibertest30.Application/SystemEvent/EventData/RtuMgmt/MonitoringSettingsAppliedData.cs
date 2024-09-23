using System.Text.Json;

namespace Fibertest30.Application;

public class MonitoringSettingsAppliedData : ISystemEventData
{
    public string RtuId { get; init; }
    public string Title { get; init; }

    public bool IsMonitoringOn { get; init; }

    public MonitoringSettingsAppliedData(string rtuId, string title, bool isMonitoringOn)
    {
        RtuId = rtuId;
        Title = title;
        IsMonitoringOn = isMonitoringOn;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}