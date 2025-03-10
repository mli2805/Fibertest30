using System.Text.Json;

namespace Fibertest30.Application;
public class TraceCleanedData : ISystemEventData
{
    public string TraceId { get; init; }

    public TraceCleanedData(string traceId)
    {
        TraceId = traceId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}