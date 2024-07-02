using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.EditPortLabels)]
public record AddAndAttachPortLabelCommand(string Name, string HexColor, int MonitoringPortId) : IRequest<Unit>;

public class AddAndAttachPortLabelCommandHandler : IRequestHandler<AddAndAttachPortLabelCommand, Unit>
{
    private readonly IPortLabelRepository _portLabelRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public AddAndAttachPortLabelCommandHandler(IPortLabelRepository portLabelRepository,
        ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _portLabelRepository = portLabelRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(AddAndAttachPortLabelCommand request, CancellationToken ct)
    {
        var normalizedName = request.Name.NormalizePortLabelName();
        
        var portLabelId = await _portLabelRepository.AddAndAttachPortLabel
        (normalizedName, request.HexColor, request.MonitoringPortId, ct);
        
        var portLabelData = new PortLabelData(portLabelId, normalizedName, request.HexColor);
        await _systemEventSender.Send(
            SystemEventFactory.PortLabelAttached(_currentUserService.UserId!, portLabelData, request.MonitoringPortId)
        );
        
        return Unit.Value;
    }
}