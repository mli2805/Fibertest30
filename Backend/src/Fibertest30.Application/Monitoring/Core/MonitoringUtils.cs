namespace Fibertest30.Application;

public static class MonitoringUtils
{
    public static MonitoringAlarmLevel? GetMostSevereChangeLevel(this List<MonitoringChange> changes)
    {
        if (changes.Count == 0)
        {
            return null;
        }
        
        return changes.Select(x => x.Level).Distinct().Max();
    }
}