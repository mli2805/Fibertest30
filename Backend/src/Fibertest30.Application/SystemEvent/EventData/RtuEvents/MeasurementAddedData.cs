using System.Text.Json;

namespace Fibertest30.Application;

public class MeasurementAddedData : ISystemEventData
{
    public int EventId { get; set; } // get from SorFileId
    public bool IsEvent { get; set; } // not just measurement, get from EventStatus
    public bool IsOk { get; set; } // get from TraceState

    public MeasurementAddedData(int eventId, bool isEvent, bool isOk)
    {
        EventId = eventId;
        IsEvent = isEvent;
        IsOk = isOk;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}