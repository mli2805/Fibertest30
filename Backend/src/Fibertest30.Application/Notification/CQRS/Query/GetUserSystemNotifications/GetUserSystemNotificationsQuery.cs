using MediatR;

namespace Fibertest30.Application;

public record GetUserSystemNotificationsQuery : IRequest<List<SystemEvent>>;

public class GetUserSystemNotificationsQueryHandler(ICurrentUserService currentUserService)
    : IRequestHandler<GetUserSystemNotificationsQuery, List<SystemEvent>>
{
    private readonly ICurrentUserService _currentUserService = currentUserService;

    public  Task<List<SystemEvent>> Handle(GetUserSystemNotificationsQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(new List<SystemEvent>());
    }
}