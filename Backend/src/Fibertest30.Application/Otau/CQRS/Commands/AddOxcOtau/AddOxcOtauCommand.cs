using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ConfigureOtau)]
public record AddOxcOtauCommand(int OcmPortIndex, string IpAddress, int Port) : IRequest<Unit>;

public class AddOxcOtauCommandHandler : IRequestHandler<AddOxcOtauCommand, Unit>
{
    private readonly IOtauService _otauService;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public AddOxcOtauCommandHandler(IOtauService otauService, 
        ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _otauService = otauService;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(AddOxcOtauCommand request, CancellationToken ct)
    {
        var otau = await _otauService.AddOxcOtau(request.OcmPortIndex, request.IpAddress, request.Port, ct);
        
        await _systemEventSender.Send(
            SystemEventFactory.OtauAdded(_currentUserService.UserId!,
                otau.Id, otau.OcmPortIndex, otau.Type, otau.SerialNumber, otau.PortCount));

        return Unit.Value;
    }
}