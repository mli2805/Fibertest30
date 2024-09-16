using System.Text.Json;

namespace Fibertest30.Application;

public class MonitoringStoppedData : ISystemEventData
{
    public string RtuId { get; init; }
    public bool IsSuccess { get; }

    public MonitoringStoppedData(string rtuId, bool isSuccess)
    {
        RtuId = rtuId;
        IsSuccess = isSuccess;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}