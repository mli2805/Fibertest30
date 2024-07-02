using System.Text.Json;

namespace Fibertest30.Application;

public class BaselineFailedData : ISystemEventData
{
    public string TaskId { get; set; }
    public int MonitoringPortId { get; set; }
    public string FailReason { get; set; }

    public BaselineFailedData(string taskId, int monitoringPortId, string failReason)
    {
        TaskId = taskId;
        MonitoringPortId = monitoringPortId;
        FailReason = failReason;
    }
    
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}