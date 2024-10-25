using System;
using System.Text.Json;

namespace Fibertest30.Application;

public class RtuAccidentAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from Id
    public DateTime RegisteredAt { get; }
    public string Obj { get; }
    public string ObjId { get; set; }
    public string EventType { get; set; }
    public bool IsGoodAccident { get; set; }

    public RtuAccidentAddedData(int eventId, DateTime registeredAt, string obj, string objId, bool isGoodAccident)
    {
        EventId = eventId;
        RegisteredAt = registeredAt;
        Obj = obj;
        ObjId = objId;
        EventType = "RtuAccident";
        IsGoodAccident = isGoodAccident;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}