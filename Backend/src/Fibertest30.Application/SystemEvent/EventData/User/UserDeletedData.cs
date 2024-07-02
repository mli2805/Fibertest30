using System.Text.Json;

namespace Fibertest30.Application;

public class UserDeletedData : ISystemEventData
{
    public string UserId { get; init; }
    
    public UserDeletedData(string userId)
    {
        UserId = userId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}