namespace Fibertest30.Application;

public class SnmpContentBuilder : ISnmpContentBuilder
{
    private readonly IDeviceInfoProvider _deviceInfoProvider;

    public SnmpContentBuilder(IDeviceInfoProvider deviceInfoProvider)
    {
        _deviceInfoProvider = deviceInfoProvider;
    }

    public Dictionary<int, string> BuildSnmpPayload(OtauPortPath portPath, MonitoringAlarmEvent alarmEvent)
    {
        var timezone = _deviceInfoProvider.GetTimeZone();


        // do not use 10th index - it reserved for specific trap value in SnmpV3TrapV2
        var result = new Dictionary<int, string>
        {
            [1] = alarmEvent.Status.AlarmStatusToString(),
            [2] = alarmEvent.Type.AlarmTypeToString(),
            [3] = alarmEvent.Level.AlarmLevelToString(),
            [4] = alarmEvent.At.DateTimeToString(timezone),
            [5] = _deviceInfoProvider.GetSerialNumber(),
            [6] = _deviceInfoProvider.GetIpV4Address(),
            [7] = portPath.ToTitle(),
            [8] = $"{alarmEvent.DistanceMeters:F2}"
        };

        return result;
    }
}