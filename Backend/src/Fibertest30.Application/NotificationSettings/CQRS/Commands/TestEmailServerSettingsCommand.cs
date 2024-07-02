using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeNotificationSettings)]
public record TestEmailServerSettingsCommand(EmailServer EmailServer) : IRequest<Unit>;

public class TestEmailServerSettingsCommandHandler : IRequestHandler<TestEmailServerSettingsCommand, Unit>
{
    private readonly IEmailService _emailService;
    private readonly IEmailBuilder _emailBuilder;
    private readonly INotificationSettingsRepository _notificationSettingsRepository;

    public TestEmailServerSettingsCommandHandler(
        IEmailService emailService, IEmailBuilder emailBuilder, 
        INotificationSettingsRepository notificationSettingsRepository)
    {
        _emailService = emailService;
        _emailBuilder = emailBuilder;
        _notificationSettingsRepository = notificationSettingsRepository;
    }

    public async Task<Unit> Handle(TestEmailServerSettingsCommand request, CancellationToken cancellationToken)
    {
        var newServer = request.EmailServer;
        if (string.IsNullOrEmpty(newServer.ServerPassword))
        {
            var password = await _notificationSettingsRepository.GetEmailServerPassword(cancellationToken);
            newServer.ServerPassword = password;
        }

        var emailsTo = new List<Tuple<string, string>>() { new("",newServer.OutgoingAddress) };
        var subject = "RFTS-400 test email";
        var htmlMessage = _emailBuilder.GetTestHtmlBody();
        await _emailService.SendEmailAsync(newServer, emailsTo, subject, htmlMessage, null, cancellationToken);

        return Unit.Value;
    }
}