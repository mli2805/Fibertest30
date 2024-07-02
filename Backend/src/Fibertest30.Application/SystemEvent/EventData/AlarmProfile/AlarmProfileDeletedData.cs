using System.Text.Json;

namespace Fibertest30.Application;

public class AlarmProfileDeletedData : ISystemEventData
{
    public int AlarmProfileId { get; init; }

    public AlarmProfileDeletedData(int alarmProfileId)
    {
        AlarmProfileId = alarmProfileId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}