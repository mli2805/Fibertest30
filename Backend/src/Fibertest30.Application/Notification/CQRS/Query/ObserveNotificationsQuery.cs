using MediatR;

namespace Fibertest30.Application;

public record ObserveNotificationsQuery() : IRequest<DisposableObservable<INotificationEvent>>;

public class ObserveNotificationsQueryHandler : IRequestHandler<ObserveNotificationsQuery, DisposableObservable<INotificationEvent>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IInAppChannelSender _inAppChannelSender;

    public ObserveNotificationsQueryHandler(IInAppChannelSender inAppChannelSender, 
        ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
        _inAppChannelSender = inAppChannelSender;
    }

    public Task<DisposableObservable<INotificationEvent>> 
        Handle(ObserveNotificationsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        return Task.FromResult(_inAppChannelSender.ObserveNotificationEvents(userId!));
    }
}