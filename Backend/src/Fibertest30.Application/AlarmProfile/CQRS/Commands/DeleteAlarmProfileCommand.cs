using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeAlarmProfiles)]
public record DeleteAlarmProfileCommand(int AlarmProfileId) : IRequest<Unit>;

public class DeleteAlarmProfileCommandHandler : IRequestHandler<DeleteAlarmProfileCommand, Unit>
{
    private readonly IAlarmProfileRepository _alarmProfileRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public DeleteAlarmProfileCommandHandler(IAlarmProfileRepository alarmProfileRepository, ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _alarmProfileRepository = alarmProfileRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(DeleteAlarmProfileCommand request, CancellationToken cancellationToken)
    {
        await _alarmProfileRepository.DeleteAlarmProfile(request.AlarmProfileId, cancellationToken);

        await _systemEventSender.Send(SystemEventFactory
            .AlarmProfileDeleted(_currentUserService.UserId!, request.AlarmProfileId));

        return Unit.Value;
    }
}
