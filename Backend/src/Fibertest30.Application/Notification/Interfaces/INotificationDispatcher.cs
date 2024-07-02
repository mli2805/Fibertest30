namespace Fibertest30.Application;

public interface INotificationDispatcher
{
    Task ProcessNotifications(CancellationToken ct);
}