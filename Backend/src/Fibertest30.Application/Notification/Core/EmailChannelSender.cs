using Fiberizer.Common;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Application;

public class EmailChannelSender : IEmailChannelSender
{
    private readonly ILogger<EmailChannelSender> _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public EmailChannelSender(ILogger<EmailChannelSender> logger, IServiceScopeFactory serviceScopeFactory)
    {
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task Send(MonitoringAlarmEvent alarmEvent, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();

        var notificationSettingsRepository = scope.ServiceProvider.GetRequiredService<INotificationSettingsRepository>();
        var emailServer = await notificationSettingsRepository.GetEmailServer(ct);
        if (!emailServer.Enabled) { return; }

        var userRepository = scope.ServiceProvider.GetRequiredService<IUsersRepository>();
        var users = await userRepository.GetUsersToNotifyAboutAlarm();
        if (users.Count == 0) { return; }

        var portPath = GetOtauPortPathByMonitoringPortId(alarmEvent.MonitoringPortId);

        var emailBuilder = scope.ServiceProvider.GetRequiredService<IEmailBuilder>();
        var sors = await FetchMonitoringSors(alarmEvent, ct);
        var emailAttachments = emailBuilder.BuildAlarmAttachments(portPath, alarmEvent, sors[0], sors[1]);

        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

        foreach (var user in users)
        {
            if (user.User.Email.IsNullOrEmpty())
            {
                return;
            }
            
            // We have some alarm event, but we get the whole alarm with the history to send the email
            // We assume there is no changes in the alarm before we send the email
            // If email send is delayed and alarm is changed to different status, it won't work fine
            // Probably we need to find smarter way to create proper alarm from the last alarmEvent
            
            var alarmRepository = scope.ServiceProvider.GetRequiredService<IMonitoringAlarmRepository>();
            var alarm = await alarmRepository.GetAlarmWithEvents(alarmEvent.MonitoringAlarmId, alarmEvent.MonitoringAlarmGroupId, ct);
            
            // var userSettings = await FetchUserSettings(user.User);
            // var localTime = ConvertToLocalTimeForUser(monitoringAlarmEvent.At, userSettings);

            var emailsTo = new List<Tuple<string, string>>() { new(user.User.GetFullName(), user.User.Email!) };
            var subject = emailBuilder.BuildAlarmSubject(portPath, alarmEvent);
            var email = emailBuilder.BuildAlarmHtmlBody(portPath, alarm);
            await emailService.SendEmailAsync(emailServer, emailsTo, subject, email, emailAttachments, ct);
        }
    }

    private OtauPortPath GetOtauPortPathByMonitoringPortId(int monitoringPortId)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var otauService = scope.ServiceProvider.GetRequiredService<IOtauService>();
        return otauService.GetOtauPortPathByMonitoringPortId(monitoringPortId);
    }
    
    private async Task<UserSettings?> FetchUserSettings(ApplicationUser user)
    {
        using var scope = _serviceScopeFactory.CreateScope();

        var userSettingsRepository = scope.ServiceProvider.GetRequiredService<IUserSettingsRepository>();
        return await userSettingsRepository.GetUserSettings(user.Id);
    }

    private async Task<List<byte[]>> FetchMonitoringSors(MonitoringAlarmEvent monitoringAlarmEvent, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();

        var monitoringRepository = scope.ServiceProvider.GetRequiredService<IMonitoringRepository>();
        var monitoringResult = await monitoringRepository.Get(monitoringAlarmEvent.MonitoringResultId, addExtra: false);
        var measurementBytes = await monitoringRepository.GetSor(monitoringAlarmEvent.MonitoringResultId);

        var baselineRepository = scope.ServiceProvider.GetRequiredService<IBaselineRepository>();
        var baselineBytes = await baselineRepository.GetSor(monitoringResult.BaselineId, ct);

        return new List<byte[]> { measurementBytes, baselineBytes };
    }

    public Task Send(SystemEvent systemEvent, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}