using System.Text.Json;

namespace Fibertest30.Application;
public class NotificationSettingsUpdatedData : ISystemEventData
{
    public string Part { get; set; }
    public NotificationSettingsUpdatedData(string part)
    {
        Part = part;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}
