using System.Text.Json;

namespace Fibertest30.Application;

public class OtauConnectionStatusChangedData : ISystemEventData
{
    public int OtauId { get; init; }
    
    public bool IsConnected { get; init; }
    
    public DateTime? OnlineAt { get; init; }
    
    public DateTime? OfflineAt { get; init; }
    
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}