using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ConfigureOtau)]
public record UpdateOtauCommand(int OtauId, OtauPatch Patch) : IRequest<Unit>;

public class UpdateOtauCommandHandler : IRequestHandler<UpdateOtauCommand, Unit>
{
    private readonly IOtauService _otauService;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public UpdateOtauCommandHandler(IOtauService otauService, 
        ISystemEventSender systemEventSender, 
        ICurrentUserService currentUserService)
    {
        _otauService = otauService;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateOtauCommand request, CancellationToken ct)
    {
        var changedProperties = await _otauService.UpdateOtau(request.OtauId, request.Patch, ct);

        await _systemEventSender.Send(
            SystemEventFactory.OtauInformationChanged(_currentUserService.UserId!, request.OtauId, changedProperties));

        return Unit.Value;
    }

}