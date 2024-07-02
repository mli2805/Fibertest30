using System.Text.Json;

namespace Fibertest30.Application;

public class OnDemandCompletedData : ISystemEventData
{
    public string OnDemandId { get; init; }
    public int MonitoringPortId { get; init; }
    
    public OnDemandCompletedData(string onDemandId, int monitoringPortId)
    {
        OnDemandId = onDemandId;
        MonitoringPortId = monitoringPortId;
    }
    
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}