namespace Fibertest30.Application;

public interface INotificationSender
{
    Task Send(INotificationEvent notificationEvent, CancellationToken ct);
}