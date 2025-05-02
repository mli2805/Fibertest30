using System.Text.Json;

namespace Fibertest30.Application;

public record BopNetworkEventAddedData(
    int EventId,
    DateTime RegisteredAt,
    string BopIp,
    string BopId,
    string RtuId,
    bool IsOk) : ISystemEventData
{
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}