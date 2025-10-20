using MailKit.Net.Smtp;
using MimeKit;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

namespace Fibertest30.Infrastructure;

public class EmailService : IEmailService
{
    public async Task<bool> SendEmailAsync(EmailServer emailServer, List<Tuple<string, string>> emailsTo,
        string subject, string htmlMessage, List<Tuple<string, byte[]>>? attachments, CancellationToken ct)
    {
        var emailMessage = CreateMessage(emailServer, emailsTo, subject, htmlMessage, attachments);
        using var client = new SmtpClient();
        client.Timeout = 3000;

        if (emailServer.VerifyCertificate)
        {
            client.ServerCertificateValidationCallback = MySslCertificateValidationCallback;
        }

        try
        {
            // на RFTS400 такое правило
            // for port 465 ssl must be turned on
            // for ports 25 & 587 ssl must be turned off  -    otherwise it failed to connect
            // но на mail.ru работает 25 порт + ssl
            // поэтому даем пользователю полную свободу настроек

            await client.ConnectAsync(emailServer.ServerAddress, emailServer.ServerPort, emailServer.IsSslOn, ct);
        }
        catch (FailedToVerifySmtpServerCertificateException)
        {
            throw;
        }
        catch (Exception)
        {
            throw new FailedToConnectEmailServerException("Failed to connect SMTP server");
        }

        if (emailServer.IsAuthenticationOn)
        {
            try
            {
                await client.AuthenticateAsync(emailServer.ServerUserName, emailServer.ServerPassword, ct);
            }
            catch (Exception)
            {
                throw new FailedToAuthenticateException("Failed to authenticate on SMTP server");
            }
        }

        try
        {
            await client.SendAsync(emailMessage, ct);
        }
        catch (SmtpCommandException e)
        {
            // if authentication is turned off but server does not allow that
            if (e.ErrorCode == SmtpErrorCode.RecipientNotAccepted)
                throw new FailedToAuthenticateException("Failed to authenticate on SMTP server");
            throw new FailedToSendEmailException("Failed to send email");
        }
        catch (Exception)
        {
            throw new FailedToSendEmailException("Failed to send email");
        }

        await client.DisconnectAsync(true, ct);
        return true;
    }

    bool MySslCertificateValidationCallback(object sender, X509Certificate? certificate, X509Chain? chain, SslPolicyErrors sslPolicyErrors)
    {
        if (sslPolicyErrors == SslPolicyErrors.None)
            return true;

        throw new FailedToVerifySmtpServerCertificateException("Failed to verify SMTP server certificate");
    }

    private MimeMessage CreateMessage(EmailServer emailServer, List<Tuple<string, string>> emailsTo,
        string subject, string htmlMessage, List<Tuple<string, byte[]>>? attachments)
    {
        var emailMessage = new MimeMessage();

        emailMessage.From.Add(GetFromAddress(emailServer.OutgoingAddress));
        foreach (var emailTo in emailsTo)
        {
            emailMessage.To.Add(new MailboxAddress(emailTo.Item1, emailTo.Item2));
        }
        emailMessage.Subject = subject;

        var builder = new BodyBuilder();
        builder.HtmlBody = htmlMessage;

        if (attachments != null)
            foreach (var pair in attachments)
            {
                var attachment = new MimePart
                {
                    Content = new MimeContent(new MemoryStream(pair.Item2)),
                    ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                    ContentTransferEncoding = ContentEncoding.Base64,
                    FileName = pair.Item1,
                };
                builder.Attachments.Add(attachment);
            }
        emailMessage.Body = builder.ToMessageBody();

        return emailMessage;
    }
    
    private MailboxAddress GetFromAddress(string outgoingAddress)
    {
        return new MailboxAddress("IIT Fibertest30", outgoingAddress);
    }


}
