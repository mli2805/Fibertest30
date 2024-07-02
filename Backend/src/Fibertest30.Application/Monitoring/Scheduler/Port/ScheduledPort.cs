namespace Fibertest30.Application;

public abstract class ScheduledPort
{
    public int MonitoringPortId { get; init; }
    public TimeSpan TestTime { get; init; }
    public DateTime LastRun { get; set; }
    public SchedulerLastRunBy LastRunBy { get; private set; }
    public DateTime NextRun { get; private set; }
    public SchedulePortStatistics Statistics { get; } = new();

    protected ScheduledPort(int monitoringPortId, TimeSpan testTime, DateTime? lastRun = null)
    {
        if (testTime < TimeSpan.Zero)
        {
            throw new ArgumentException($"{nameof(testTime)} must be greater than zero");
        }
        
        MonitoringPortId = monitoringPortId;
        TestTime = testTime;
        LastRun = lastRun ?? DateTime.MinValue;
    }
    
    protected abstract DateTime CalculateNextRun(DateTime now);
    
    public void UpdateNextRun(DateTime now)
    {
        NextRun = CalculateNextRun(now);
    }
    
    public void SetLastRunBy(SchedulerLastRunBy lastRunBy)
    {
        LastRunBy = lastRunBy;
    }
    
    public void UpdateLastRun(DateTime lastRun, DateTime now)
    {
        Statistics.AddRun(LastRun, lastRun);
        LastRun = lastRun;
        UpdateNextRun(now);
    }
}