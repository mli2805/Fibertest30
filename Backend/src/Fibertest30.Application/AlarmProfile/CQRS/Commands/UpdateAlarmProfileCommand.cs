using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeAlarmProfiles)]
public record UpdateAlarmProfileCommand(AlarmProfile AlarmProfile) : IRequest<Unit>;

public class UpdateAlarmProfileCommandHandler : IRequestHandler<UpdateAlarmProfileCommand, Unit>
{
    private readonly IAlarmProfileRepository _alarmProfileRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public UpdateAlarmProfileCommandHandler(IAlarmProfileRepository alarmProfileRepository, ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _alarmProfileRepository = alarmProfileRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateAlarmProfileCommand request, CancellationToken cancellationToken)
    {
        await _alarmProfileRepository.UpdateAlarmProfile(request.AlarmProfile, cancellationToken);

        await _systemEventSender.Send(SystemEventFactory
            .AlarmProfileChanged(_currentUserService.UserId!, request.AlarmProfile.Id, request.AlarmProfile.Name));

        return Unit.Value;
    }
}
