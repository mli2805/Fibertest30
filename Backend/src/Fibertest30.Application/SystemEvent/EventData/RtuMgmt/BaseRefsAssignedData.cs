using System.Text.Json;

namespace Fibertest30.Application;

public class BaseRefsAssignedData : ISystemEventData
{
    public string RtuId { get; init; }
    public string TraceTitle { get; init; }

    public BaseRefsAssignedData(string rtuId, string traceTitle)
    {
        RtuId = rtuId;
        TraceTitle = traceTitle;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}