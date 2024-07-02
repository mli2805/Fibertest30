using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace Fibertest30.Infrastructure;

public class NotificationSettingsRepository : INotificationSettingsRepository
{
    private readonly RtuContext _rtuContext;

    public NotificationSettingsRepository(RtuContext rtuContext)
    {
        _rtuContext = rtuContext;
    }

    public async Task<NotificationSettings> GetSettingsWithoutPasswords(CancellationToken ct)
    {
        var settingsEf = await _rtuContext.NotificationSettings.SingleAsync(ct);
        var settings = settingsEf.FromEf();
        settings.EmailServer!.IsPasswordSet = settings.EmailServer!.ServerPassword != "";
        settings.EmailServer!.ServerPassword = "";

        settings.TrapReceiver!.IsAuthPswSet = settings.TrapReceiver!.AuthenticationPassword != "";
        settings.TrapReceiver!.AuthenticationPassword = "";
        settings.TrapReceiver!.IsPrivPswSet = settings.TrapReceiver!.PrivacyPassword != "";
        settings.TrapReceiver!.PrivacyPassword = "";
        return settings;
    }

    public async Task<EmailServer> GetEmailServer(CancellationToken ct)
    {
        var settingsEf = await _rtuContext.NotificationSettings.SingleAsync(ct);
        var emailServer = settingsEf.FromEf().EmailServer!;
        emailServer.ServerPassword = DecodePassword(emailServer.ServerPassword);
        return emailServer;
    }

    public async Task<TrapReceiver> GetTrapReceiver(CancellationToken ct)
    {
        var settingsEf = await _rtuContext.NotificationSettings.SingleAsync(ct);
        var trapReceiver = settingsEf.FromEf().TrapReceiver!;
        trapReceiver.AuthenticationPassword = DecodePassword(trapReceiver.AuthenticationPassword);
        trapReceiver.PrivacyPassword = DecodePassword(trapReceiver.PrivacyPassword);
        return trapReceiver;
    }

    public async Task UpdateNotificationSettings(NotificationSettings notificationSettings, CancellationToken ct)
    {
        var existingSettings = await _rtuContext.NotificationSettings.SingleOrDefaultAsync(ct);
        if (existingSettings == null)
        {
            throw new NullReferenceException("NotificationSettings not found");
        }

        var newEmailServer = notificationSettings.EmailServer;
        if (newEmailServer != null)
        {
            if (newEmailServer.IsAuthenticationOn)
            {
                newEmailServer.ServerPassword = newEmailServer.ServerPassword != ""
                    ? EncodePassword(newEmailServer.ServerPassword)
                    : JsonSerializer.Deserialize<EmailServer>(existingSettings.EmailServer)!.ServerPassword;
            }

            existingSettings.EmailServer = newEmailServer.ToJsonData();
        }

        var newTrapReceiver = notificationSettings.TrapReceiver;
        if (newTrapReceiver != null)
        {
            newTrapReceiver.AuthenticationPassword = newTrapReceiver.AuthenticationPassword == ""
                ? JsonSerializer.Deserialize<TrapReceiver>(existingSettings.TrapReceiver)!.AuthenticationPassword
                : EncodePassword(newTrapReceiver.AuthenticationPassword);

            newTrapReceiver.PrivacyPassword = newTrapReceiver.PrivacyPassword == ""
                ? JsonSerializer.Deserialize<TrapReceiver>(existingSettings.TrapReceiver)!.PrivacyPassword
                : EncodePassword(newTrapReceiver.PrivacyPassword);

            existingSettings.TrapReceiver = newTrapReceiver.ToJsonData();
        }


        await _rtuContext.SaveChangesAsync(ct);
    }

    public async Task<string> GetEmailServerPassword(CancellationToken ct)
    {
        var settingsEf = await _rtuContext.NotificationSettings.SingleAsync(ct);
        var settings = settingsEf.FromEf();
        var password = DecodePassword(settings.EmailServer!.ServerPassword);
        return password;
    }

    public async Task<Tuple<string, string>> GetTrapReceiverPasswords(CancellationToken ct)
    {
        var settingsEf = await _rtuContext.NotificationSettings.SingleAsync(ct);
        var settings = settingsEf.FromEf();
        var authPassword = DecodePassword(settings.TrapReceiver!.AuthenticationPassword);
        var privPassword = DecodePassword(settings.TrapReceiver!.PrivacyPassword);
        return new Tuple<string, string>(authPassword, privPassword);
    }

    private string EncodePassword(string password)
    {
        var bytes = Encoding.UTF8.GetBytes(password);
        for (int i = 0; i < bytes.Length; i++)
            bytes[i] = (byte)(bytes[i] ^ 173);

        string result = Convert.ToHexString(bytes);
        return result;
    }

    private string DecodePassword(string password)
    {
        int count = password.Length;
        byte[] bytes = new byte[count / 2];
        for (int i = 0; i < count; i += 2)
            bytes[i / 2] = Convert.ToByte(password.Substring(i, 2), 16);
        for (int i = 0; i < bytes.Length; i++)
            bytes[i] = (byte)(bytes[i] ^ 173);

        return Encoding.UTF8.GetString(bytes);
    }
}