namespace Fibertest30.Application;

public class SnmpContentBuilder : ISnmpContentBuilder
{

    public Dictionary<int, string> BuildSnmpPayload(string portPath, MonitoringAlarmEvent alarmEvent)
    {

        // do not use 10th index - it reserved for specific trap value in SnmpV3TrapV2
        var result = new Dictionary<int, string>
        {
            [1] = alarmEvent.Status.AlarmStatusToString(),
            [2] = alarmEvent.Type.AlarmTypeToString(),
            [3] = alarmEvent.Level.AlarmLevelToString(),
            [4] = alarmEvent.At.ToLongDateString(),
            [5] = "123456",
            [6] = "192.168.96.21",
            [7] = portPath,
            [8] = $"{alarmEvent.DistanceMeters:F2}"
        };

        return result;
    }
}