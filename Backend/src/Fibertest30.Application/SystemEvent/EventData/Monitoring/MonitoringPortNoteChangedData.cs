using System.Text.Json;

namespace Fibertest30.Application;

public class MonitoringPortNoteChangedData: ISystemEventData
{
    public int MonitoringPortId { get; init; }
    public string Note { get; init; }
    public MonitoringPortNoteChangedData(int monitoringPortId, string note)
    {
        MonitoringPortId = monitoringPortId;
        Note = note;
    }
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}