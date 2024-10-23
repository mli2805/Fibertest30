using System.Text.Json;

namespace Fibertest30.Application;

public class BopNetworkEventAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from Ordinal
    public DateTime RegisteredAt { get; set; }
    public string At { get; set; }
    public string Obj { get; set; }
    public string EventType { get; set; }
    public bool IsOk { get; set; }


    public BopNetworkEventAddedData(int eventId, DateTime registeredAt, string obj, bool isOk)
    {
        EventId = eventId;
        RegisteredAt = registeredAt;
        At = registeredAt.ToString("R"); // неправильное время, но в таблице datetime.pipe показывает правильно
        IsOk = isOk;
        EventType = "BopNetworkEvent";
        Obj = obj;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}