using System.Text.Json;

namespace Fibertest30.Application;

public class BopNetworkEventAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from Ordinal
    public DateTime RegisteredAt { get; set; }
    public string Obj { get; set; }
    public string ObjId { get; set; } // BOP serial
    public string EventType { get; set; }
    public bool IsOk { get; set; }


    public BopNetworkEventAddedData(int eventId, DateTime registeredAt, string obj, string objId, bool isOk)
    {
        EventId = eventId;
        RegisteredAt = registeredAt;
        IsOk = isOk;
        EventType = "BopNetworkEvent";
        Obj = obj;
        ObjId = objId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}