using Fibertest30.Infrastructure;

namespace Fibertest30.Application;

public class MonitoringPortEf
{
    public int Id { get; init; }
    public string Name { get;set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public int? BaselineId { get; set; }
    public MonitoringBaselineEf? Baseline { get; set; }
    public MonitoringPortStatus Status { get; set; }
    public MonitoringSchedulerMode SchedulerMode { get; set; }
    public TimeSpan? Interval { get; set; }
    public DateTime? LastRun { get; set; }
    public ICollection<MonitoringTimeSlotEf>? TimeSlots { get; set; }
    public OtauPortEf OtauPort { get; set; } = null!;

    public ICollection<MonitoringBaselineEf> BaselineHistory { get; set; } = null!;
    
    public ICollection<PortLabelEf> PortLabels { get; set; } = null!;
    public ICollection<PortLabelMonitoringPortEf> PortLabelMonitoringPorts { get; set; } = null!;
}

