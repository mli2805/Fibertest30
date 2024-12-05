using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetRtuQuery(string RtuId) : IRequest<RtuDto>;

public class GetRtuQueryHandler : IRequestHandler<GetRtuQuery, RtuDto>
{
    private readonly Model _writeModel;
    private readonly ICurrentUserService _currentUserService;

    public GetRtuQueryHandler(Model writeModel, ICurrentUserService currentUserService)
    {
        _writeModel = writeModel;
        _currentUserService = currentUserService;
    }

    public Task<RtuDto> Handle(GetRtuQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId!;
        User user = _writeModel.Users.FirstOrDefault(u => u.Title == userId) ?? _writeModel.Users.First(u => u.Title == "root");
        return Task.FromResult(_writeModel.GetRtu(request.RtuId, user));

    }
}


