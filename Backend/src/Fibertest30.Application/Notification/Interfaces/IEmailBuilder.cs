namespace Fibertest30.Application;

public interface IEmailBuilder
{
    string GetTestHtmlBody();

    string BuildAlarmSubject(string portPath, MonitoringAlarmEvent alarmEvent);
    public string BuildAlarmHtmlBody(string portPath, MonitoringAlarm alarm);
    List<Tuple<string, byte[]>> BuildAlarmAttachments(string portPath, MonitoringAlarmEvent alarmEvent, byte[] measurement, byte[] baseline);
}