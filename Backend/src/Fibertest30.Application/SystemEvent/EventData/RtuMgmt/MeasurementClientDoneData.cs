using System.Text.Json;

namespace Fibertest30.Application;

public class MeasurementClientDoneData : ISystemEventData
{
    public Guid MeasurementClientId { get; init; }

    public MeasurementClientDoneData(Guid measurementClientId)
    {
        MeasurementClientId = measurementClientId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}