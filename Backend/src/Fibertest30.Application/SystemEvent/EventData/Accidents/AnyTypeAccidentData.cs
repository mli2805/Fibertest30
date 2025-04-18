using System.Text.Json;

namespace Fibertest30.Application;

public class AnyTypeAccidentData : ISystemEventData
{
    public string EventType { get; set; }
    public int EventId { get; set; } // get from Id or SorFileId or Ordinal
    public DateTime RegisteredAt { get; }
    public string ObjTitle { get; }
    public string ObjId { get; set; }
    public string RtuId { get; set; } // для NetworkEvent будет совпадать с objId, остальным полезно чтобы в клиенте не искать
    public bool IsOk { get; set; } // or IsGoodAccident or IsRtuAvailable

    public AnyTypeAccidentData(string eventType, int eventId, DateTime registeredAt,
        string objTitle, string objId, string rtuId, bool isOk)
    {
        EventType = eventType;
        EventId = eventId;
        RegisteredAt = registeredAt;
        ObjTitle = objTitle;
        ObjId = objId;
        RtuId = rtuId;
        IsOk = isOk;
    }
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}