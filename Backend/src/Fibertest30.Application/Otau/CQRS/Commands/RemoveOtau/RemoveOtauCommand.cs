using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ConfigureOtau)]
public record RemoveOtauCommand(int OtauId) : IRequest<Unit>;

public class RemoveOtauCommandHandler : IRequestHandler<RemoveOtauCommand, Unit>
{
    private readonly IOtauService _otauService;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public RemoveOtauCommandHandler(IOtauService otauService, 
        ISystemEventSender systemEventSender,
        ICurrentUserService currentUserService)
    {
        _otauService = otauService;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(RemoveOtauCommand request, CancellationToken ct)
    {
        var removedOtau = await _otauService.RemoveOtau(request.OtauId, ct);
        await _systemEventSender.Send(
            SystemEventFactory.OtauRemoved(_currentUserService.UserId!,
                removedOtau.Id, removedOtau.OcmPortIndex, removedOtau.Type,
                removedOtau.SerialNumber, removedOtau.PortCount));
        
        return Unit.Value;
    }
}