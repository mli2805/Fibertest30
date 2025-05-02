using Iit.Fibertest.Dto;
using System.Text.Json;

namespace Fibertest30.Application;

public record TraceStateChangedData(
    int EventId,
    DateTime RegisteredAt,
    string TraceId,
    string TraceTitle,
    string RtuId,
    BaseRefType BaseRefType,
    FiberState TraceState)
    : ISystemEventData
{
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}