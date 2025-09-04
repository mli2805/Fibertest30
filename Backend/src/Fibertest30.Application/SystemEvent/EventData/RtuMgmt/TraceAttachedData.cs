using Iit.Fibertest.Dto;
using System.Text.Json;

namespace Fibertest30.Application;

public record TraceAttachedData(string TraceId, string TraceTitle, FiberState TraceState,
    string PortPath, string RtuId, string RtuTitle) : ISystemEventData
{
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}
