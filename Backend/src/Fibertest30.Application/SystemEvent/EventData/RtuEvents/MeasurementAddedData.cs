using System.Text.Json;

namespace Fibertest30.Application;

public class MeasurementAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from SorFileId
    public DateTime RegisteredAt { get; set; }
    public string At { get; set; }
    public string Obj { get; set; }
    public string EventType { get; set; }
    public bool IsEvent { get; set; } // not just measurement, get from EventStatus
    public bool IsOk { get; set; } // get from TraceState

    public MeasurementAddedData(int eventId, DateTime registeredAt, string obj,  bool isEvent, bool isOk)
    {
        EventId = eventId;
        RegisteredAt = registeredAt;
        At = registeredAt.ToString("R"); // неправильное время, но в таблице datetime.pipe показывает правильно
        Obj = obj;
        IsEvent = isEvent;
        EventType = "OpticalEvent";
        IsOk = isOk;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}