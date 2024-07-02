namespace Fibertest30.Application;

public class SystemEvent : INotificationEvent
{
    public int Id { get; set; } = 0!;
    public SystemEventType Type { get; init; }
    public SystemEventLevel Level { get; init; } 
    public ISystemEventData? Data { get; init; }  // null if event has no data
    public SystemEventSource Source { get; init; }
    
    public DateTime At { get; set; }

    public SystemEvent(SystemEventType type, 
        SystemEventLevel level,
        ISystemEventData? data,
        SystemEventSource source)
    {
        Type = type;
        Level = level;
        Data = data;
        Source = source;
    }
}


