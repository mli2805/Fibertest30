using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetRtuTreeQuery : IRequest<List<RtuDto>>;

public class GetRtuTreeQueryHandler: IRequestHandler<GetRtuTreeQuery, List<RtuDto>>
{
    private readonly Model _model;
    private readonly ICurrentUserService _currentUserService;

    public GetRtuTreeQueryHandler(Model model, ICurrentUserService currentUserService)
    {
        _model = model;
        _currentUserService = currentUserService;
    }

    public Task<List<RtuDto>> Handle(GetRtuTreeQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId!;
        User user = _model.Users.FirstOrDefault(u=>u.Title == userId) ?? _model.Users.First(u=>u.Title == "root");
        return Task.FromResult(_model.GetTree(user).ToList());
    }
}
