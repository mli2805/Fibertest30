using Iit.Fibertest.Graph;

namespace Fibertest30.Application;

public interface IInAppChannelSender : IChannelSender
{
    DisposableObservable<INotificationEvent> ObserveNotificationEvents(string userId);
    Task DisposeAllUserObservers(string userId);
    Task DisposeAllObservers();

}