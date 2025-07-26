using System.Text.Json;

namespace Fibertest30.Application;

public class MeasurementAddedData(string traceId, int sorFileId) : ISystemEventData
{
    public string TraceId { get; } = traceId;
    public int SorFileId { get; } = sorFileId;

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}