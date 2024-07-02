using System.Text.Json;

namespace Fibertest30.Application;

public class BaselineCompletedData : ISystemEventData
{
    public string TaskId { get; set; }
    public int MonitoringPortId { get; init; }
    public int BaselineId { get; init; }
    
    public BaselineCompletedData(string taskId, int monitoringPortId, int baselineId)
    {
        TaskId = taskId;
        MonitoringPortId = monitoringPortId;
        BaselineId = baselineId;
    }
    
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}