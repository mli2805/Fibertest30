using System.Text.Json;

namespace Fibertest30.Application;

public class MonitoringSettingsAppliedData : ISystemEventData
{
    public string RtuId { get; init; }
    public string Title { get; init; }

    public MonitoringSettingsAppliedData(string rtuId, string title)
    {
        RtuId = rtuId;
        Title = title;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}