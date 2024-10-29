using System.Text.Json;

namespace Fibertest30.Application;

public class TraceAttachedData : ISystemEventData
{
    public string TraceId { get; set; }
    public string TraceTitle { get; init; }
    public string PortPath { get; init; }
    public string RtuId { get; set; }
    public string RtuTitle { get; init; }

    public TraceAttachedData(string traceId, string traceTitle, string portPath, string rtuId, string rtuTitle)
    {
        TraceId = traceId;
        TraceTitle = traceTitle;
        PortPath = portPath;
        RtuId = rtuId;
        RtuTitle = rtuTitle;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}
