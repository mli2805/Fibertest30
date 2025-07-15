using Iit.Fibertest.Dto;
using System.Text.Json;

namespace Fibertest30.Application;

public class LandmarksUpdateProgressedData(
    Guid landmarksModelId, LandmarksUpdateProgress step, Guid traceId, int traceCount, int traceNumber,
    ReturnCode returnCode, bool isSuccess) : ISystemEventData
{
    public Guid LandmarksModelId { get; } = landmarksModelId;
    public LandmarksUpdateProgress Step { get; } = step;
    public Guid TraceId { get; } = traceId;
    public int TraceCount { get; } = traceCount;
    public int TraceNumber { get; } = traceNumber;
    public ReturnCode ReturnCode { get; } = returnCode;
    public bool IsSuccess { get; } = isSuccess;

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}