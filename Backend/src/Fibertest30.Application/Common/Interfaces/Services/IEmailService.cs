namespace Fibertest30.Application;

public interface IEmailService
{
    Task<bool> SendEmailAsync(EmailServer emailServer, List<Tuple<string, string>> emailsTo,
        string subject, string htmlMessage, List<Tuple<string, byte[]>>? attachments, CancellationToken ct);
}