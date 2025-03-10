using System.Text.Json;

namespace Fibertest30.Application;

public class TraceAddedData : ISystemEventData
{
    public string TraceId { get; init; }
    public string RtuId { get; init; }

    public TraceAddedData(string traceId, string rtuId)
    {
        TraceId = traceId;
        RtuId = rtuId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}