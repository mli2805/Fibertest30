namespace Fibertest30.Application;

public interface IEmailBuilder
{
    string GetTestHtmlBody();

    string BuildAlarmSubject(OtauPortPath portPath, MonitoringAlarmEvent alarmEvent);
    public string BuildAlarmHtmlBody(OtauPortPath portPath, MonitoringAlarm alarm);
    List<Tuple<string, byte[]>> BuildAlarmAttachments(OtauPortPath portPath, MonitoringAlarmEvent alarmEvent, byte[] measurement, byte[] baseline);
}