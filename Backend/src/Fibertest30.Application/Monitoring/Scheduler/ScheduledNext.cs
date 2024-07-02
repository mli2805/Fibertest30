namespace Fibertest30.Application;

public class ScheduledNext
{
    public ScheduledPort? Port { get; set; }
    public ScheduledDelay? Delay { get; set; }
    
    public bool IsNothingToRun()
    {
        return Delay != null && Delay.NextScheduleAt == DateTime.MaxValue;
    }

    public ScheduledNext(ScheduledPort port)
    {
        Port = port;
    }
    
    public ScheduledNext(ScheduledDelay delay)
    {
        Delay = delay;
    }
}