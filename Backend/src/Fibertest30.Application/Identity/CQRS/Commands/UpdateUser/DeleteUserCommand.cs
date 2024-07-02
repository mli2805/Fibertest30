using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.EditUsers)]
public record DeleteUserCommand(string UserId) : IRequest<Unit>;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Unit>
{
    private readonly IUsersRepository _usersRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;
    private readonly IInAppChannelSender _inAppChannelSender;


    public DeleteUserCommandHandler(
        IUsersRepository usersRepository, 
        ISystemEventSender systemEventSender, 
        ICurrentUserService currentUserService,
        IInAppChannelSender inAppChannelSender)
    {
        _usersRepository = usersRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
        _inAppChannelSender = inAppChannelSender;
    }

    public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        await _usersRepository.DeleteUser(request.UserId);
        
        await _inAppChannelSender.DisposeAllUserObservers(request.UserId);

        await _systemEventSender.Send(
            SystemEventFactory.UserDeleted(_currentUserService.UserId!, request.UserId)
        );

        return Unit.Value;
    }
}