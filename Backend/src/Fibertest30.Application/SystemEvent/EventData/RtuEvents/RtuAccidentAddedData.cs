using System.Text.Json;

namespace Fibertest30.Application;

public class RtuAccidentAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from Id
    public bool IsGoodAccident { get; set; }

    public RtuAccidentAddedData(int eventId, bool isGoodAccident)
    {
        EventId = eventId;
        IsGoodAccident = isGoodAccident;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}