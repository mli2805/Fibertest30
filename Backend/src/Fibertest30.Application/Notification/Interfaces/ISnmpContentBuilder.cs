namespace Fibertest30.Application;

public interface ISnmpContentBuilder
{
    Dictionary<int, string> BuildSnmpPayload(OtauPortPath portPath, MonitoringAlarmEvent alarmEvent);
}