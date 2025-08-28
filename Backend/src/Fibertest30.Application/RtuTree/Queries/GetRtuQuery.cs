using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetRtuQuery(string RtuId) : IRequest<RtuDto>;

public class GetRtuQueryHandler(Model writeModel, ICurrentUserService currentUserService) : IRequestHandler<GetRtuQuery, RtuDto>
{
    public Task<RtuDto> Handle(GetRtuQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId!;
        // временно
        var zoneId = Guid.Empty;
        return Task.FromResult(writeModel.GetRtu(request.RtuId, zoneId));

    }
}


