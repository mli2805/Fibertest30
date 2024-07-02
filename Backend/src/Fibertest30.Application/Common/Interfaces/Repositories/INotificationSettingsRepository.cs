namespace Fibertest30.Application;

public interface INotificationSettingsRepository
{
    Task<NotificationSettings> GetSettingsWithoutPasswords(CancellationToken ct);
    Task<EmailServer> GetEmailServer(CancellationToken ct);
    Task<TrapReceiver> GetTrapReceiver(CancellationToken ct);

    Task UpdateNotificationSettings(NotificationSettings notificationSettings, CancellationToken ct);

    Task<string> GetEmailServerPassword(CancellationToken ct);
    Task<Tuple<string, string>> GetTrapReceiverPasswords(CancellationToken ct);

}