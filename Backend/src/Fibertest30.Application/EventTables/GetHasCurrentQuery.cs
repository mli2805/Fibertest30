using MediatR;

namespace Fibertest30.Application;

public record GetHasCurrentQuery : IRequest<HasCurrentEvents>;

public class GetHasCurrentQueryHandler(TableProvider tableProvider, ICurrentUserService currentUserService)
    : IRequestHandler<GetHasCurrentQuery, HasCurrentEvents>
{
    public Task<HasCurrentEvents> Handle(GetHasCurrentQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId!;

        var hasCurrentEvents = tableProvider.GetHasCurrentEvents(userId);
        return Task.FromResult(hasCurrentEvents);
    }
}

