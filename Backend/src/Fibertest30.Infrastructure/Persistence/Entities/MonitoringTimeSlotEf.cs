namespace Fibertest30.Application;

public class MonitoringTimeSlotEf
{
    public int Id { get; set; }
    public int? MonitoringPortId { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    
    public MonitoringPortEf? MonitoringPort { get; set; } = null!;
}