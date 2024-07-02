using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.EditPortLabels)]
public record DetachPortLabelCommand(int PortLabelId, int MonitoringPortId) : IRequest<Unit>;

public class DetachPortLabelCommandHandler : IRequestHandler<DetachPortLabelCommand, Unit>
{
    private readonly IPortLabelRepository _portLabelRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public DetachPortLabelCommandHandler(IPortLabelRepository portLabelRepository,
        ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _portLabelRepository = portLabelRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(DetachPortLabelCommand request, CancellationToken ct)
    {
        // get the portLabel before detaching it, as the portLabel may be removed if it is the last one
        var portLabel = await _portLabelRepository.Get(request.PortLabelId, CancellationToken.None);
        
        await _portLabelRepository.DetachPortLabelAndRemoveIfLast(request.PortLabelId, request.MonitoringPortId,
            ct);
        
        await _systemEventSender.Send(
            SystemEventFactory.PortLabelDetached
                (_currentUserService.UserId!, portLabel.ToPortLabelData(), request.MonitoringPortId)
        );
        
        return Unit.Value;
    }
}