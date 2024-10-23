using System;
using System.Text.Json;

namespace Fibertest30.Application;

public class RtuAccidentAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from Id
    public DateTime RegisteredAt { get; }
    public string At { get; set; }
    public string Obj { get; }
    public string EventType { get; set; }
    public bool IsGoodAccident { get; set; }

    public RtuAccidentAddedData(int eventId, DateTime registeredAt, string obj, bool isGoodAccident)
    {
        EventId = eventId;
        RegisteredAt = registeredAt;

        //_dateTime.UtcNow
        // At = registeredAt.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss \"GMT\"zzz");
        At = registeredAt.ToString("R"); // неправильное время, но в таблице datetime.pipe показывает правильно
        Obj = obj;
        EventType = "RtuAccident";
        IsGoodAccident = isGoodAccident;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}