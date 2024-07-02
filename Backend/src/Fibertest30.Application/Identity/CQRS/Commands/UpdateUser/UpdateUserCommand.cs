using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.EditUsers)]
[AllowCurrentUserChangingHimself]
public record UpdateUserCommand(string UserId, ApplicationUserPatch Patch) : IRequest<Unit>;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Unit>
{
    private readonly IUsersRepository _usersRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public UpdateUserCommandHandler(IUsersRepository usersRepository,
        ISystemEventSender systemEventSender, ICurrentUserService currentUserService)

    {
        _usersRepository = usersRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        await _usersRepository.UpdateUser(request.UserId, request.Patch);
        
        var changedProperties = request.Patch.GetType().GetProperties()
            .Where(p => p.GetValue(request.Patch) != null)
            .Select(p => p.Name)
            .ToList();
        
        await _systemEventSender.Send(
            SystemEventFactory.UserChanged(_currentUserService.UserId!, request.UserId, changedProperties)
        );
        
        return Unit.Value;
    }
}
