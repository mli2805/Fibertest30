namespace Fibertest30.Application;

public class SchedulePortStatistics
{
    public TimeSpanMaxMinAverage TimesBetweenRuns { get; } = new();
    public int RunCount { get; set; }

    public void AddRun(DateTime previousLastRun, DateTime lastRun)
    {
        // skip the first run
        // lastRun could be DateTime.Min, or could be too far from a new run
        if (RunCount != 0) 
        {
            var timeBetweenRuns = lastRun - previousLastRun;
            TimesBetweenRuns.Add(timeBetweenRuns);
        }
        
        RunCount++;
    }
}