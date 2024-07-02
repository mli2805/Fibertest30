namespace Fibertest30.Application;

public interface IEmailBodyBuilder
{
    string BuildEmailBody(OtauPortPath portPath, MonitoringAlarm monitoringAlarm);
}