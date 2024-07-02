namespace Fibertest30.Application;

public class ScheduledDelay
{
    public static ScheduledDelay Infinity => new ScheduledDelay(DateTime.MaxValue);
    public DateTime NextScheduleAt { get; set; }

    public ScheduledDelay(DateTime nextScheduleAt)
    {
        NextScheduleAt = nextScheduleAt;
    }
}