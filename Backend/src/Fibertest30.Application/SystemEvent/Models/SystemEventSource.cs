namespace Fibertest30.Application;

public enum SystemEventAppSource
{
    System
}

public class SystemEventSource
{
    public static SystemEventSource FromUser(string userId)
    {
        return new SystemEventSource { UserId = userId };
    }
    
    public static  SystemEventSource FromSource(string source)
    {
        return new SystemEventSource { Source = source };
    }

    private SystemEventSource()
    {
        
    }
    
    public string? UserId { get; init; }
    public string? Source { get; init; }
    
}