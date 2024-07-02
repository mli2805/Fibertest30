using System.Text.Json;

namespace Fibertest30.Application;

public class TimeSettingsUpdatedData : ISystemEventData
{
    public TimeSettings Settings { get; init; }

    public TimeSettingsUpdatedData(TimeSettings settings)
    {
        Settings = settings;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}