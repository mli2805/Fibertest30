namespace Fibertest30.Application;

public interface ISnmpContentBuilder
{
    Dictionary<int, string> BuildSnmpPayload(string portPath, MonitoringAlarmEvent alarmEvent);
}