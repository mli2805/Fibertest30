using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;
public record GetBopEventsQuery(bool Current) : IRequest<List<BopEventDto>>;

public class GetBopEventsQueryHandler : IRequestHandler<GetBopEventsQuery, List<BopEventDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly TableProvider _tableProvider;

    public GetBopEventsQueryHandler(ICurrentUserService currentUserService, TableProvider tableProvider)
    {
        _currentUserService = currentUserService;
        _tableProvider = tableProvider;
    }

    public Task<List<BopEventDto>> Handle(GetBopEventsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var portion = _tableProvider.GetBopEvents(Guid.Parse(userId!), request.Current);
        return Task.FromResult(portion);
    }
}

