using MediatR;

namespace Fibertest30.Application;

public record GetUserQuery(string UserId) : IRequest<AuthenticatedUser>;

public class GetUserQueryHandler : IRequestHandler<GetUserQuery, AuthenticatedUser>
{
    private readonly IUsersRepository _usersRepository;

    public GetUserQueryHandler(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }

    public async Task<AuthenticatedUser> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        return await _usersRepository.GetUser(request.UserId);
    }
}
