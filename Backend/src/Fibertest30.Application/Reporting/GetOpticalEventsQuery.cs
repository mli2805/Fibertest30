using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetOpticalEventsQuery() : IRequest<List<OpticalEventDto>>;

public class GetOpticalEventsQueryHandler : IRequestHandler<GetOpticalEventsQuery, List<OpticalEventDto>>
{
    private readonly Model _writeModel;
    private readonly ICurrentUserService _currentUserService;
    private readonly TableProvider _tableProvider;

    public GetOpticalEventsQueryHandler(Model writeModel, ICurrentUserService currentUserService, TableProvider tableProvider)
    {
        _writeModel = writeModel;
        _currentUserService = currentUserService;
        _tableProvider = tableProvider;
    }


    public Task<List<OpticalEventDto>> Handle(GetOpticalEventsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var portion = _tableProvider.GetOpticalEvents(Guid.Parse(userId!));
        return Task.FromResult(portion);
    }
}
