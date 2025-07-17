using System.Text.Json;

namespace Fibertest30.Application;

public class BaseRefsAssignedData : ISystemEventData
{
    public string RtuId { get; init; }
    public string TraceId { get; init; }
    public string TraceTitle { get; init; }
    public bool HasBaseRefs { get; init; }

    public BaseRefsAssignedData(string rtuId, string traceId, string traceTitle, bool hasBaseRefs)
    {
        RtuId = rtuId;
        TraceId = traceId;
        TraceTitle = traceTitle;
        HasBaseRefs = hasBaseRefs;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}