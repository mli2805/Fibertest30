using System.Text.Json;

namespace Fibertest30.Application;

public class RtuInitializedData : ISystemEventData
{
    public string RtuId { get; init; }
    public string Title { get; init; }

    public RtuInitializedData(string rtuId, string title)
    {
        RtuId = rtuId;
        Title = title;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}