using System.Text.Json;

namespace Fibertest30.Application;

public class NetworkEventAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from Ordinal
    public DateTime RegisteredAt { get; }
    public string At { get; set; }
    public string Obj { get; }
    public string ObjId { get; set; }
    public string EventType { get; set; }
    public bool IsRtuAvailable { get; set; }

    public NetworkEventAddedData(int eventId, DateTime registeredAt, string obj, string objId, bool isRtuAvailable)
    {
        EventId = eventId;
        RegisteredAt = registeredAt;
        At = registeredAt.ToString("R"); // неправильное время, но в таблице datetime.pipe показывает правильно
        Obj = obj;
        ObjId = objId;
        EventType = "NetworkEvent";
        IsRtuAvailable = isRtuAvailable;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}