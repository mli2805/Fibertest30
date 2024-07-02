using System.Text.Json;

namespace Fibertest30.Application;

public class UserChangedData : ISystemEventData
{
    public string UserId { get; init; }
    public List<string> ChangedProperties { get; init; }
    public UserChangedData(string userId, List<string> changedProperties)
    {
        UserId = userId;
        ChangedProperties = changedProperties;
    }
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}