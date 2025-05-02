using System.Text.Json;

namespace Fibertest30.Application;

public record NetworkEventAddedData(int EventId,
    DateTime RegisteredAt, string RtuTitle, string RtuId, bool IsOk) : ISystemEventData
{
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}