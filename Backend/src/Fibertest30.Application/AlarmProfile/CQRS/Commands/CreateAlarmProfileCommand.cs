using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeAlarmProfiles)]
public record CreateAlarmProfileCommand(AlarmProfile AlarmProfile): IRequest<int>;

public class CreateAlarmProfileCommandHandler : IRequestHandler<CreateAlarmProfileCommand, int>
{
    private readonly IAlarmProfileRepository _alarmProfileRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public CreateAlarmProfileCommandHandler(IAlarmProfileRepository alarmProfileRepository, ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _alarmProfileRepository = alarmProfileRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(CreateAlarmProfileCommand request, CancellationToken cancellationToken)
    {
        var createdProfileId = await _alarmProfileRepository.CreateAlarmProfile(request.AlarmProfile, cancellationToken);

        await _systemEventSender.Send(SystemEventFactory.AlarmProfileCreated(_currentUserService.UserId!,
            createdProfileId, request.AlarmProfile.Name));
        return createdProfileId;
    }
}