using System.Text.Json;

namespace Fibertest30.Application;
public class TraceDetachedData : ISystemEventData
{
    public string TraceId { get; set; }
    public string Title { get; init; }
    public string RtuId { get; set; }

    public TraceDetachedData(string traceId, string title, string rtuId)
    {
        TraceId = traceId;
        Title = title;
        RtuId = rtuId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}