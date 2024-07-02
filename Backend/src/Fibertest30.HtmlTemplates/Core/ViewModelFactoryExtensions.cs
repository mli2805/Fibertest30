using Fibertest30.Application;

namespace Fibertest30.HtmlTemplates;

public static class ViewModelFactoryExtensions
{
    public static string ToStatusColor(this MonitoringAlarmStatus status, MonitoringAlarmLevel level)
    {
        return status == MonitoringAlarmStatus.Resolved ? "resolved" : level.ToLevelValue();
    }
    
    public static string ToStatusOnlyResolvedColor(this MonitoringAlarmStatus status)
    {
        return status == MonitoringAlarmStatus.Resolved ? "resolved" : string.Empty;
    }
    
    public static string ToStatusColor(this MonitoringAlarmStatus? status, MonitoringAlarmLevel level)
    {
        if (status == null)
        {
            return level.ToLevelValue();
        }

        return status.Value.ToStatusColor(level);
    }
    
    public static string ToLevelValue(this MonitoringAlarmLevel level)
    {
        return level.ToString().ToLowerInvariant();
    }
    
    public static string ToStatusValue(this MonitoringAlarmStatus status)
    {
        return status.ToString().ToLowerInvariant();
    }
    
    public static string ToKmOrM(this double? distanceMeters)
    {
        if (distanceMeters.HasValue)
        {
            if (distanceMeters.Value < 1000)
            {
                string formatted = distanceMeters.Value.ToString("0.##");
                return $"{formatted}m";
            }
            else
            {
                string formatted = (distanceMeters.Value / 1000).ToString("0.###");
                return $"{formatted}km";
            }
        }

        return string.Empty;
    }
}