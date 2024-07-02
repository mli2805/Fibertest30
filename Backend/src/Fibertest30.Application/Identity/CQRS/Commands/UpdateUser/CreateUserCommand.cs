using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.EditUsers)]
public record CreateUserCommand(ApplicationUserPatch Patch) : IRequest<Unit>;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Unit>
{
    private readonly IUsersRepository _usersRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public CreateUserCommandHandler(IUsersRepository usersRepository,
        ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _usersRepository = usersRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(CreateUserCommand request, CancellationToken ct)
    {
        var createUserId = await _usersRepository.CreateUser(request.Patch);
        
        await _systemEventSender.Send(
            SystemEventFactory.UserCreated(_currentUserService.UserId!, createUserId)
        );
        
        return Unit.Value;
    }
}