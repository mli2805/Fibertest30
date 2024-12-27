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
        User user = writeModel.Users.FirstOrDefault(u => u.Title == userId) ?? writeModel.Users.First(u => u.Title == "root");
        return Task.FromResult(writeModel.GetRtu(request.RtuId, user));

    }
}


