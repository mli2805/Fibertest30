namespace Fibertest30.Application;

public static class SchedulerModeler
{
    public static MonitoringScheduler Run(
        SchedulerModelerDateTime dateTime,
        List<ScheduledPort> ports, 
        TimeSpan modelerPeriod, 
        Func<MonitoringScheduler, bool>? beforeStart = null,
        Func<MonitoringScheduler, ScheduledNext, bool>? onNext = null)
    {
        var schedulerStartTime = dateTime.UtcNow;
        var scheduler = new MonitoringScheduler(ports, dateTime);
        
        if (beforeStart?.Invoke(scheduler) ?? false)
        {
            return scheduler;
        }
        
        foreach (var next in scheduler)
        {
            if (next.Port != null)
            {
                var startTime = dateTime.UtcNow;
                dateTime.Add(next.Port.TestTime);
                next.Port.UpdateLastRun(startTime, dateTime.UtcNow);
            }

            if (next.Delay != null)
            {
                if (next.Delay.NextScheduleAt == DateTime.MaxValue)
                {
                    break;
                }
                
                dateTime.Set(next.Delay.NextScheduleAt);
            }
            
            if (onNext?.Invoke(scheduler, next) ?? false)
            {
                break;
            }

            if (dateTime.UtcNow - schedulerStartTime >= modelerPeriod)
            {
                break;
            }
        }

        return scheduler;
    }
}