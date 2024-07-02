namespace Fibertest30.Application;

public class AtLeastOnceInPort : ScheduledPort
{
    public TimeSpan Interval { get; set; }

    public AtLeastOnceInPort(int monitoringPortIndex, TimeSpan testTime, TimeSpan interval,
        DateTime? lastRun = null)
        : base(monitoringPortIndex, testTime, lastRun)
    {
        if (interval < TimeSpan.Zero)
        {
            throw new ArgumentException($"{nameof(interval)}` must be greater than zero");
        }


        Interval = interval;
    }

    protected override DateTime CalculateNextRun(DateTime now)
    {
        return LastRun + Interval;
    }
}