using System.Text.Json;

namespace Fibertest30.Application;

public class MonitoringPortScheduleChangedData : ISystemEventData
{
    public int MonitoringPortId { get; init; }
    public MonitoringSchedulerMode Mode { get; init; }
    public int? Interval { get; init; }
    public List<int>? TimeSlotIds { get; init; }

    public MonitoringPortScheduleChangedData(int monitoringPortId, 
        MonitoringSchedulerMode mode, int? interval, List<int>? timeSlotIds)
    {
        MonitoringPortId = monitoringPortId;
        Mode = mode;
        Interval = interval;
        TimeSlotIds = timeSlotIds;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);

    }
}