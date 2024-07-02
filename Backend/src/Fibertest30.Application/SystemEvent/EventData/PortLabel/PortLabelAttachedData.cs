using System.Text.Json;

namespace Fibertest30.Application;

public class PortLabelAttachedData : ISystemEventData
{
    public PortLabelData PortLabel { get; set; }
    public int MonitoringPortId { get; set; }

    public PortLabelAttachedData(PortLabelData portLabel, int monitoringPortId)
    {
        PortLabel = portLabel;
        MonitoringPortId = monitoringPortId;
    }
    
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}