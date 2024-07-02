using System.Text.Json;

namespace Fibertest30.Application;

public class MonitoringPortAlarmProfileChangedData : ISystemEventData
{
    public int MonitoringPortId { get; init; }
    public int AlarmProfileId { get; init; }
    public MonitoringPortAlarmProfileChangedData(int monitoringPortId, int alarmProfileId)
    {
        MonitoringPortId = monitoringPortId;
        AlarmProfileId = alarmProfileId;
    }
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}