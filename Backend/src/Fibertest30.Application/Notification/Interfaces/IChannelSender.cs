using Iit.Fibertest.Graph;

namespace Fibertest30.Application;

public interface IChannelSender
{
    Task SendNoti<T>(T o, CancellationToken ct) where T : INotificationEvent;

    Task Send(SystemEvent systemEvent, CancellationToken ct);

}

