using System.Text.Json;

namespace Fibertest30.Application;

public class BaseRefsAssignedData : ISystemEventData
{
    private readonly bool _hasBaseRefs;
    public string RtuId { get; init; }
    public string TraceId { get; init; }
    public string TraceTitle { get; init; }
    public bool HasBaseRefs { get; init; }

    public BaseRefsAssignedData(string rtuId, string traceId, string traceTitle, bool hasBaseRefs)
    {
        _hasBaseRefs = hasBaseRefs;
        RtuId = rtuId;
        TraceId = traceId;
        TraceTitle = traceTitle;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}