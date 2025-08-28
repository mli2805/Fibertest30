using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetHasCurrentQuery : IRequest<HasCurrentEvents>;

public class GetHasCurrentQueryHandler : IRequestHandler<GetHasCurrentQuery, HasCurrentEvents>
{
    private readonly TableProvider _tableProvider;
    private readonly Model _model;
    private readonly ICurrentUserService _currentUserService;

    public GetHasCurrentQueryHandler(TableProvider tableProvider, Model model, ICurrentUserService currentUserService)
    {
        _tableProvider = tableProvider;
        _model = model;
        _currentUserService = currentUserService;
    }

    public Task<HasCurrentEvents> Handle(GetHasCurrentQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId!;

        var hasCurrentEvents = _tableProvider.GetHasCurrentEvents(userId);
        return Task.FromResult(hasCurrentEvents);
    }
}

