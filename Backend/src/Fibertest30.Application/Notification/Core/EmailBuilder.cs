using Microsoft.Extensions.DependencyInjection;

namespace Fibertest30.Application;

public class EmailBuilder : IEmailBuilder
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public EmailBuilder( IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public string BuildAlarmSubject(string portPath, MonitoringAlarmEvent alarmEvent)
    {
        string status;
        if (alarmEvent.OldLevel != null && alarmEvent.Status != MonitoringAlarmStatus.Active)
        {
            status = $"{alarmEvent.OldLevel.Value.AlarmLevelToString()} -> {alarmEvent.Level.AlarmLevelToString()}";
        }
        else 
        {
            status = alarmEvent.Status.AlarmStatusToString();
        }

        return $"Alarm ID {alarmEvent.MonitoringAlarmId} | {status} | Port {portPath}";
    }

    public string BuildAlarmHtmlBody(string portPath, MonitoringAlarm alarm)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var bodyBuilder = scope.ServiceProvider.GetRequiredService<IEmailBodyBuilder>();
        var body = bodyBuilder.BuildEmailBody(portPath, alarm);
        return body;
    }

    public List<Tuple<string, byte[]>> BuildAlarmAttachments(
        string portPath,
        MonitoringAlarmEvent monitoringAlarmEvent,byte[] measurement, byte[] baseline)
    {
        var port = $"Port {portPath}";
        var measurementFilename = $"Alarm ID {monitoringAlarmEvent.MonitoringAlarmId} - {port}.sor";
        var baselineFilename = $"Baseline - {port}.sor";
        return new List<Tuple<string, byte[]>> { new(measurementFilename, measurement), new(baselineFilename, baseline)};
    }

    public string GetTestHtmlBody()
    {
        return @"
<!DOCTYPE html>
<html>
<head>
    <title>Fibertest30 test email</title>
</head>
<body>
    <div style=""padding: 20px;"">
        <div style=""margin-top: 20px;"">
            <p>This is a test email to ensure email settings are correctly configured.</p>
        </div>
    </div>
</body>
</html>";
    }
}
