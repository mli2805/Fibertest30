namespace Fibertest30.Application;

public class RoundRobinPort : ScheduledPort
{
    public RoundRobinPort(int portIndex, TimeSpan testTime, DateTime? lastRun = null)
        : base(portIndex, testTime, lastRun)
    {
    }

    protected override DateTime CalculateNextRun(DateTime now)
    {
        return LastRun;
    }
}