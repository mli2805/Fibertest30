using Fiberizer.Common;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.DependencyInjection;

namespace Fibertest30.Application;

public class EmailChannelSender(IServiceScopeFactory serviceScopeFactory) : IEmailChannelSender
{
    public async Task SendNoti<T>(T o, CancellationToken ct) where T: INotificationEvent
    {
        switch (o)
        {
            case AddMeasurement measurement: await Send(measurement, ct); break;
            case NetworkEvent networkEvent: await Send(networkEvent, ct); break;
            case BopNetworkEvent bopNetworkEvent: await Send(bopNetworkEvent, ct); break;
            case RtuAccident rtuAccident: await Send(rtuAccident, ct); break;
        }
    }

    public async Task Send(AddMeasurement measurement, CancellationToken ct)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var model = scope.ServiceProvider.GetRequiredService<Model>();

        var notificationSettingsRepository = scope.ServiceProvider.GetRequiredService<INotificationSettingsRepository>();
        var emailServer = await notificationSettingsRepository.GetEmailServer(ct);
        if (!emailServer.Enabled) { return; }

        var userRepository = scope.ServiceProvider.GetRequiredService<IUsersRepository>();
        var users = await userRepository.GetUsersToNotifyAboutAlarm();
        if (users.Count == 0) { return; }


        var emailBuilder = scope.ServiceProvider.GetRequiredService<IEmailBuilder>();
        // TODO вычищал то что относится к rfts400, надо будет сделать для fibertest
        var sors = new List<byte[]>();
        var emailAttachments = emailBuilder.BuildOpticalAttachments(measurement, sors[0], sors[1]);

        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

        foreach (var user in users)
        {
            if (user.User.Email.IsNullOrEmpty())
            {
                return;
            }



            var emailsTo = new List<Tuple<string, string>>() { new(user.User.GetFullName(), user.User.Email!) };
            var subject = emailBuilder.BuildOpticalEventSubject(measurement, model);
            var email = emailBuilder.BuildOpticalEventHtmlBody(measurement, model);
            await emailService.SendEmailAsync(emailServer, emailsTo, subject, email, emailAttachments, ct);
        }
    }

    public Task Send(NetworkEvent networkEvent, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task Send(BopNetworkEvent bopNetworkEvent, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task Send(RtuAccident rtuStatusEvent, CancellationToken ct)
    {
        throw new NotImplementedException();
    }




    public Task Send(SystemEvent systemEvent, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}