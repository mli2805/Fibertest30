using System.Text.Json;

namespace Fibertest30.Application;

public class RtuInitializedData(string rtuId, string title) : ISystemEventData
{
    public string RtuId { get; init; } = rtuId;
    public string Title { get; init; } = title;

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}