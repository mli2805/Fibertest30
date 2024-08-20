namespace Fibertest30.Application;

public interface IEmailBodyBuilder
{
    string BuildEmailBody(string portPath, MonitoringAlarm monitoringAlarm);
}