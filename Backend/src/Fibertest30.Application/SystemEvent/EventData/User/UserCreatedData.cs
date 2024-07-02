using System.Text.Json;

namespace Fibertest30.Application;

public class UserCreatedData : ISystemEventData
{
    public string UserId { get; init; }
    
    public UserCreatedData(string userId)
    {
        UserId = userId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}