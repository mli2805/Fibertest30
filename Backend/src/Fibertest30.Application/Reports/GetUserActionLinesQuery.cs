using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetUserActionLinesQuery(Guid UserId, DateTimeFilter DateTimeFilter, List<int> OperationCodes) : 
    IRequest<List<UserActionLine>>;

public class GetUserActionLinesQueryHandler(Model writeModel, IUsersRepository usersRepository)
    : IRequestHandler<GetUserActionLinesQuery, List<UserActionLine>>
{
    public async Task<List<UserActionLine>> Handle(GetUserActionLinesQuery request, CancellationToken cancellationToken)
    {
        var users = await usersRepository.GetAllUsers();

        var lines = writeModel
            .GetFilteredUserActions(users, request.UserId, request.DateTimeFilter, request.OperationCodes);

        return lines;
    }
}

