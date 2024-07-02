namespace Fibertest30.Application;

public class MonitoringTimeSlot
{
    public int Id { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}