using System.Text.Json;

namespace Fibertest30.Application;

public class BopNetworkEventAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from Ordinal
    public bool IsOk { get; set; }

    public BopNetworkEventAddedData(int eventId, bool isOk)
    {
        EventId = eventId;
        IsOk = isOk;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}