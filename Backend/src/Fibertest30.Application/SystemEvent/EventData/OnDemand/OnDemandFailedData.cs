using System.Text.Json;

namespace Fibertest30.Application;

public class OnDemandFailedData : ISystemEventData
{
    public string OnDemandId { get; set; }
    public int MonitoringPortId { get; set; }
    public string FailReason { get; set; }

    public OnDemandFailedData(string onDemandId, int monitoringPortId, string failReason)
    {
        OnDemandId = onDemandId;
        MonitoringPortId = monitoringPortId;
        FailReason = failReason;
    }
    
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}