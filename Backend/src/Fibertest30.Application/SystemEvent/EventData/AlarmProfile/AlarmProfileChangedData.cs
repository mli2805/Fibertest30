using System.Text.Json;

namespace Fibertest30.Application;
public class AlarmProfileChangedData : ISystemEventData
{
    public int AlarmProfileId { get; init; }
    public string Name { get; init; }

    public AlarmProfileChangedData(int alarmProfileId, string name)
    {
        AlarmProfileId = alarmProfileId;
        Name = name;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}