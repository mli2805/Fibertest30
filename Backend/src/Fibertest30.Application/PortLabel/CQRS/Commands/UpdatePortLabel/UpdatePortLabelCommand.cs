using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.EditPortLabels)]
public record UpdatePortLabelCommand(int PortLabelId, string Name, string HexColor) : IRequest<Unit>;

public class UpdatePortLabelCommandHandler : IRequestHandler<UpdatePortLabelCommand, Unit>
{
    private readonly IPortLabelRepository _portLabelRepository;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public UpdatePortLabelCommandHandler(IPortLabelRepository portLabelRepository,
        ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _portLabelRepository = portLabelRepository;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdatePortLabelCommand request, CancellationToken ct)
    {
        var oldPortLabel = await _portLabelRepository.Get(request.PortLabelId, CancellationToken.None);
        
        await _portLabelRepository.UpdatePortLabel
        (request.PortLabelId, request.Name.NormalizePortLabelName(), request.HexColor, ct);
        
        var newPortLabel = await _portLabelRepository.Get(request.PortLabelId, CancellationToken.None);
        
        await _systemEventSender.Send(
            SystemEventFactory.PortLabelUpdated
                (_currentUserService.UserId!, oldPortLabel.ToPortLabelData(), newPortLabel.ToPortLabelData())
        );
        
        return Unit.Value;
    }
}