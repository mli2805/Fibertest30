using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record GetNetworkEventsQuery(bool Current, DateTimeFilter DateTimeFilter) : IRequest<List<NetworkEventDto>>;

public class GetNetworkEventsQueryHandler : IRequestHandler<GetNetworkEventsQuery, List<NetworkEventDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly TableProvider _tableProvider;

    public GetNetworkEventsQueryHandler(ICurrentUserService currentUserService, TableProvider tableProvider)
    {
        _currentUserService = currentUserService;
        _tableProvider = tableProvider;
    }

    public Task<List<NetworkEventDto>> Handle(GetNetworkEventsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var portion = _tableProvider.GetNetworkEvents(Guid.Parse(userId!), request.Current, request.DateTimeFilter);
        return Task.FromResult(portion);
    }
}

