using MediatR;

namespace Fibertest30.Application;


// TODO: Should we introduce another permission for this operation?
// or rename EditPortLabels to EditPortAnnotations?
[HasPermission(ApplicationPermission.EditPortLabels)]
public record SetMonitoringPortNoteCommand(int MonitoringPortId, string Note) : IRequest<Unit>;

public class SetMonitoringPortNoteCommandHandler : IRequestHandler<SetMonitoringPortNoteCommand, Unit>
{
    private readonly IMonitoringPortRepository _monitoringPortRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public SetMonitoringPortNoteCommandHandler(IMonitoringPortRepository monitoringPortRepository,
        ISystemEventSender systemEventSender, ICurrentUserService currentUserService)
    {
        _monitoringPortRepository = monitoringPortRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(SetMonitoringPortNoteCommand command, CancellationToken ct)
    {
        await _monitoringPortRepository.SetMonitoringPortNote(command.MonitoringPortId, command.Note, ct);
        
        await _systemEventSender.Send(
            SystemEventFactory.MonitoringPortNoteChanged
                (_currentUserService.UserId!, command.MonitoringPortId, command.Note));
        
        return Unit.Value;
    }
}