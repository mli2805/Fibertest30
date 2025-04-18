using Iit.Fibertest.Dto;
using System.Text.Json;

namespace Fibertest30.Application;

public class TraceStateChangedData(
    int eventId,
    DateTime registeredAt,
    string traceId,
    string traceTitle,
    string rtuId,
    BaseRefType baseRefType,
    FiberState traceState)
    : ISystemEventData
{
    public int EventId { get; init; } = eventId;
    public DateTime RegisteredAt { get; init; } = registeredAt;
    public string TraceId { get; init; } = traceId;
    public string TraceTitle { get; init; } = traceTitle;
    public string RtuId { get; init; } = rtuId;
    public BaseRefType BaseRefType { get; init; } = baseRefType;
    public FiberState TraceState { get; init; } = traceState;

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}