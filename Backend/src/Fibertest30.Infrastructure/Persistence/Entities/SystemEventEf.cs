namespace Fibertest30.Application;

public class SystemEventEf
{
    public int Id { get; init; } 

    public SystemEventType Type { get; init; } 

    public SystemEventLevel Level { get; init; }

    public string JsonData { get; set; } = null!;
    public DateTime At { get; set; }
    
    public string? UserId { get; init; }
    
    public string? Source { get; init; }
}