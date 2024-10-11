using System.Text.Json;

namespace Fibertest30.Application;

public class NetworkEventAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from Ordinal
    public bool IsRtuAvailable { get; set; }

    public NetworkEventAddedData(int eventId, bool isRtuAvailable)
    {
        EventId = eventId;
        IsRtuAvailable = isRtuAvailable;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}