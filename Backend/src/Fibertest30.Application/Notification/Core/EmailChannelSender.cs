using Fiberizer.Common;
using Microsoft.Extensions.DependencyInjection;

namespace Fibertest30.Application;

public class EmailChannelSender : IEmailChannelSender
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public EmailChannelSender( IServiceScopeFactory serviceScopeFactory)
    {
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

        var portPath = "42-231";

        var emailBuilder = scope.ServiceProvider.GetRequiredService<IEmailBuilder>();
        // TODO вычищал то что относится к rfts400, надо будет сделать для fibertest
        var sors = new List<byte[]>();
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

            // TODO
            var alarm = new MonitoringAlarm();
            
            // var userSettings = await FetchUserSettings(user.User);
            // var localTime = ConvertToLocalTimeForUser(monitoringAlarmEvent.At, userSettings);

            var emailsTo = new List<Tuple<string, string>>() { new(user.User.GetFullName(), user.User.Email!) };
            var subject = emailBuilder.BuildAlarmSubject(portPath, alarmEvent);
            var email = emailBuilder.BuildAlarmHtmlBody(portPath, alarm);
            await emailService.SendEmailAsync(emailServer, emailsTo, subject, email, emailAttachments, ct);
        }
    }

  
 
   

    public Task Send(SystemEvent systemEvent, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}