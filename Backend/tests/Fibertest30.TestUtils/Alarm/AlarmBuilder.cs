namespace Fibertest30.TestUtils;

public static class AlarmBuilder
{
    private static double _defaultTestDistanceMetersThreshold = 0.07;
    public static MonitoringChange CriticalLoss(double distance)
    {
        return CreateChange(MonitoringAlarmType.EventLoss, MonitoringAlarmLevel.Critical, distance);
    }

    public static MonitoringChange MajorLoss(double distance)
    {
        return CreateChange(MonitoringAlarmType.EventLoss, MonitoringAlarmLevel.Major, distance);
    }

    public static MonitoringChange FiberBreak(double distance)
    {
        return CreateChange(MonitoringAlarmType.FiberBreak, MonitoringAlarmLevel.Critical, distance);
    }

    public static MonitoringChange CreateChange(MonitoringAlarmType alarmType, MonitoringAlarmLevel level,
        double? distanceMeters)
    {
        return new MonitoringChange
        {
            Type = alarmType, 
            Level = level, 
            DistanceMeters = distanceMeters,
            DistanceThresholdMeters = distanceMeters == null ? null : _defaultTestDistanceMetersThreshold,
        };
    }
    
    public static void SetDistanceMetersThreshold(double distanceThresholdMeters)
    {
        _defaultTestDistanceMetersThreshold = distanceThresholdMeters;
    }
}