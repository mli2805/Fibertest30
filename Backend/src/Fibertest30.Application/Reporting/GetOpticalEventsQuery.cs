using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record GetOpticalEventsQuery(bool Current, DateTimeFilter DateTimeFilter, int PortionSize) : IRequest<List<OpticalEventDto>>;

public class GetOpticalEventsQueryHandler : IRequestHandler<GetOpticalEventsQuery, List<OpticalEventDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly TableProvider _tableProvider;

    public GetOpticalEventsQueryHandler(ICurrentUserService currentUserService, TableProvider tableProvider)
    {
        _currentUserService = currentUserService;
        _tableProvider = tableProvider;
    }


    public Task<List<OpticalEventDto>> Handle(GetOpticalEventsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var portion = _tableProvider
            .GetOpticalEvents(Guid.Parse(userId!), request.Current, request.DateTimeFilter, request.PortionSize);
        return Task.FromResult(portion);
    }
}
