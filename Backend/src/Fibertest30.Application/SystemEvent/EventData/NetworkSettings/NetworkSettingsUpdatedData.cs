using System.Text.Json;

namespace Fibertest30.Application;

public class NetworkSettingsUpdatedData : ISystemEventData
{
    public NetworkSettings Settings { get; init; }

    public NetworkSettingsUpdatedData(NetworkSettings settings)
    {
        Settings = settings;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}