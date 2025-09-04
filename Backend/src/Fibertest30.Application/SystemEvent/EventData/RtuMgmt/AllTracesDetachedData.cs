using System.Text.Json;

namespace Fibertest30.Application;

public class AllTracesDetachedData : ISystemEventData
{
    public string RtuId { get; }

    public AllTracesDetachedData(string rtuId)
    {
        RtuId = rtuId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}