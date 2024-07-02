using System.Text.Json;

namespace Fibertest30.Application;

public class MonitoringPortStatusChangedData : ISystemEventData
{
    public int MonitoringPortId { get; init; }
    public MonitoringPortStatus Status { get; init; }
    public MonitoringPortStatusChangedData(int monitoringPortId, MonitoringPortStatus status)
    {
        MonitoringPortId = monitoringPortId;
        Status = status;
    }
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}