namespace Fibertest30.Application;

public static class EmailBuilderExtensions
{
    public static string AlarmLevelToString(this MonitoringAlarmLevel level)
    {
        return level switch
        {
            MonitoringAlarmLevel.Critical => "Critical",
            MonitoringAlarmLevel.Major => "Major",
            MonitoringAlarmLevel.Minor => "Minor",
            _ => throw new Exception($"No matching nameId found for monitoring alarm level ${level}")
        };
    }
    
    public static string AlarmTypeToString(this MonitoringAlarmType type)
    {
        return type switch
        {
            MonitoringAlarmType.EventLoss => "Event Loss",
            MonitoringAlarmType.TotalLoss => "Total Loss",
            MonitoringAlarmType.EventReflectance => "Event Reflectance",
            MonitoringAlarmType.SectionAttenuation => "Section Attenuation",
            MonitoringAlarmType.SectionLoss => "Section Loss",
            MonitoringAlarmType.SectionLengthChange => "Section Length Change",
            MonitoringAlarmType.PortHealth => "Port Health",
            MonitoringAlarmType.FiberBreak => "Fiber Break",
            MonitoringAlarmType.NewEvent => "New Event",
            MonitoringAlarmType.NewEventAfterEof => "New Event After Eof",
            _ => throw new Exception($"No matching nameId found for monitoring alarm type ${type}")
        };
    }

    //public static int AlarmSpecificTrapType(this MonitoringAlarmType type)
    //{
    //    // 600 is reserved for test trap
    //    return type switch
    //    {
    //        MonitoringAlarmType.EventLoss => 601,
    //        MonitoringAlarmType.TotalLoss => 602,
    //        MonitoringAlarmType.EventReflectance => 603,
    //        MonitoringAlarmType.SectionAttenuation => 604,
    //        MonitoringAlarmType.SectionLoss => 605,
    //        MonitoringAlarmType.SectionLengthChange => 606,
    //        MonitoringAlarmType.PortHealth => 607,
    //        MonitoringAlarmType.FiberBreak => 608,
    //        MonitoringAlarmType.NewEvent => 609,
    //        MonitoringAlarmType.NewEventAfterEof => 610,
    //        _ => throw new Exception($"No matching nameId found for monitoring alarm type ${type}")
    //    };
    //}

    public static string AlarmStatusToString(this MonitoringAlarmStatus status)
    {
        return status switch
        {
            MonitoringAlarmStatus.Active => "Active",
            MonitoringAlarmStatus.Resolved => "Resolved",
            _ => throw new Exception($"No matching nameId found for monitoring alarm status ${status}")
        };
    }
}