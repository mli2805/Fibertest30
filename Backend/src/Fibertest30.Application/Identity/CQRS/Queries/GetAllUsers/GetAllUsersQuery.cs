using MediatR;

namespace Fibertest30.Application;

public record GetAllUsersQuery() : IRequest<List<AuthenticatedUser>>;

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, List<AuthenticatedUser>>
{
    private readonly IUsersRepository _usersRepository;

    public GetAllUsersQueryHandler(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }

    public async Task<List<AuthenticatedUser>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        return await _usersRepository.GetAllUsers();
    }
}

