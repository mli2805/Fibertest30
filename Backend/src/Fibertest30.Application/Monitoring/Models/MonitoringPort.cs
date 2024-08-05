namespace Fibertest30.Application;

public class MonitoringPort
{
    public int Id { get; init; }
    public string Note { get; set; } = string.Empty;
    public DateTime? LastRun { get; set; }
    public MonitoringPortStatus Status { get; set; }
    public MonitoringSchedulerMode Mode { get; set; }
    
    public MonitoringBaseline? Baseline { get; set; }
    public TimeSpan? Interval { get; set; }
    public List<MonitoringTimeSlot> TimeSlots { get; set; } = null!;
    
    public int OtauPortId { get; set; }
    public int OtauId { get; set; }
}
