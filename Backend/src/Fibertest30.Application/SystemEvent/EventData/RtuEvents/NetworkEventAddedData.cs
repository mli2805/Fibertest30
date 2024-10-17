using System.Text.Json;

namespace Fibertest30.Application;

public class NetworkEventAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from Ordinal
    public DateTime RegisteredAt { get; }
    public string Obj { get; }
    public string EventType { get; set; }
    public bool IsRtuAvailable { get; set; }

    public NetworkEventAddedData(int eventId, DateTime registeredAt, string obj, bool isRtuAvailable)
    {
        EventId = eventId;
        RegisteredAt = registeredAt;
        Obj = obj;
        EventType = "NetworkEvent";
        IsRtuAvailable = isRtuAvailable;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}