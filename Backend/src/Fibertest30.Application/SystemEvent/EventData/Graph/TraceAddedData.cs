using System.Text.Json;

namespace Fibertest30.Application;

public class TraceAddedData(string traceId, string rtuId) : ISystemEventData
{
    public string TraceId { get; init; } = traceId;
    public string RtuId { get; init; } = rtuId;

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}