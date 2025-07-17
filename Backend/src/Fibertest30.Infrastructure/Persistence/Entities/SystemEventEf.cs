using System.ComponentModel.DataAnnotations;

namespace Fibertest30.Infrastructure;

public class SystemEventEf
{
    public int Id { get; init; } 

    public SystemEventType Type { get; init; } 

    public SystemEventLevel Level { get; init; }

    [MaxLength(2000)]
    public string JsonData { get; set; } = null!;
    public DateTime At { get; set; }
    
    [MaxLength(100)]
    public string? UserId { get; init; }
    
    [MaxLength(100)]
    public string? Source { get; init; }
}