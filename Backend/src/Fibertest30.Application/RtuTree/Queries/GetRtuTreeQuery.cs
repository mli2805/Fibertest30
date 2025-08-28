using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetRtuTreeQuery : IRequest<List<RtuDto>>;

public class GetRtuTreeQueryHandler : IRequestHandler<GetRtuTreeQuery, List<RtuDto>>
{
    private readonly Model _writeModel;
    private readonly ICurrentUserService _currentUserService;

    public GetRtuTreeQueryHandler(Model writeModel, ICurrentUserService currentUserService)
    {
        _writeModel = writeModel;
        _currentUserService = currentUserService;
    }

    public Task<List<RtuDto>> Handle(GetRtuTreeQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId!;

        // временно
        var zoneId = Guid.Empty;

        return Task.FromResult(_writeModel.GetTree(zoneId).ToList());
    }
}
