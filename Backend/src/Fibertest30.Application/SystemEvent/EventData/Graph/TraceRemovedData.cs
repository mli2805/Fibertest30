using System.Text.Json;

namespace Fibertest30.Application;
public class TraceRemovedData : ISystemEventData
{
    public string TraceId { get; init; }

    public TraceRemovedData(string traceId)
    {
        TraceId = traceId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}