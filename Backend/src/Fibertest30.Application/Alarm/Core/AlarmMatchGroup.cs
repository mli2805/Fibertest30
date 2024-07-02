namespace Fibertest30.Application;

public class AlarmMatchGroup
{
    public List<AlarmMatch> AlarmMatches { get; } = new();
    public List<DistanceAlarmMatch> DistanceAlarmMatches { get; } = new();
}

public class AlarmMatch
{
    public AlarmMatch(MonitoringAlarm alarm, MonitoringChange change)
    {
        Alarm = alarm;
        Change = change;
    }

    public bool AlarmChanged => IsLevelChanged || IsActiveAgain;

    public bool IsLevelChanged => Alarm.Level != Change.Level;

    
    // alarm can be active again only if it was resolved
    // Acknowledged alarm is quite the same as Active
    public bool IsActiveAgain => Alarm.Status == MonitoringAlarmStatus.Resolved;


    public MonitoringAlarm Alarm { get; }
    public MonitoringChange Change { get; }
}

public class DistanceAlarmMatch : AlarmMatch
{
    public DistanceAlarmMatch(MonitoringAlarm alarm, MonitoringChange change, double metric)
        :base(alarm, change)
    {
        Metric = metric;
    }

    public double Metric { get; }
}