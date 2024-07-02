using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ConfigureOtau)]
public record AddOsmOtauCommand(int OcmPortIndex, int ChainAddress) : IRequest<Unit>;

public class AddOsmOtauCommandHandler : IRequestHandler<AddOsmOtauCommand, Unit>
{
    private readonly IOtauService _otauService;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public AddOsmOtauCommandHandler(IOtauService otauService, 
        ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _otauService = otauService;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(AddOsmOtauCommand request, CancellationToken ct)
    {
        var otau = await _otauService.AddOsmOtau(request.OcmPortIndex, request.ChainAddress, ct);
        
        await _systemEventSender.Send(
            SystemEventFactory.OtauAdded(_currentUserService.UserId!,
                otau.Id, otau.OcmPortIndex, otau.Type, otau.SerialNumber, otau.PortCount));

        return Unit.Value;
    }
}