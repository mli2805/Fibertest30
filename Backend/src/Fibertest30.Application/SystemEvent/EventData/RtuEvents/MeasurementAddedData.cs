using System.Text.Json;

namespace Fibertest30.Application;

public class MeasurementAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from SorFileId
    public DateTime RegisteredAt { get; set; }
    public string Obj { get; set; }
    public string ObjId { get; set; }
    public string EventType { get; set; }
    public bool IsEvent { get; set; } // not just measurement, get from EventStatus
    public bool IsOk { get; set; } // get from TraceState

    public MeasurementAddedData(int eventId, DateTime registeredAt, string obj, string objId,  bool isEvent, bool isOk)
    {
        EventId = eventId;
        RegisteredAt = registeredAt;
        Obj = obj;
        ObjId = objId;
        IsEvent = isEvent;
        EventType = "OpticalEvent";
        IsOk = isOk;
    }

    // время сериализуется с указанием таймзоны
    // клиент возьмет таймзону браузера и покажет правильное время относительно себя
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}