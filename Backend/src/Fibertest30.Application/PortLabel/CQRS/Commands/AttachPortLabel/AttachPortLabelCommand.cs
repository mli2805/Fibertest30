using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.EditPortLabels)]
public record AttachPortLabelCommand(int PortLabelId, int MonitoringPortId) : IRequest<Unit>;

public class AttachPortLabelCommandHandler : IRequestHandler<AttachPortLabelCommand, Unit>
{
    private readonly IPortLabelRepository _portLabelRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public AttachPortLabelCommandHandler(IPortLabelRepository portLabelRepository,
        ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _portLabelRepository = portLabelRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(AttachPortLabelCommand request, CancellationToken ct)
    {
        await _portLabelRepository.AttachPortLabel
            (request.PortLabelId, request.MonitoringPortId, ct);

        var portLabel = await _portLabelRepository.Get(request.PortLabelId, CancellationToken.None);
        
        await _systemEventSender.Send(
            SystemEventFactory.PortLabelAttached(_currentUserService.UserId!, portLabel.ToPortLabelData(), request.MonitoringPortId)
        );
        
        return Unit.Value;
    }
}