using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record DetachAllTracesCommand(Guid RtuId, string ClientIp) : IRequest<Unit>;

public class DetachAllTracesCommandHandler( ICurrentUserService currentUserService,
    IRtuManager rtuManager, ISystemEventSender systemEventSender) 
    : IRequestHandler<DetachAllTracesCommand, Unit>
{
    public async Task<Unit> Handle(DetachAllTracesCommand request, CancellationToken cancellationToken)
    {
        var result = await rtuManager.DetachAllTraces(request.RtuId, request.ClientIp);
        if (result.ReturnCode != ReturnCode.Ok)
            throw new InvalidOperationException(result.ErrorMessage);

        var systemEvent = SystemEventFactory.AllTracesDetached(currentUserService.UserId!, request.RtuId);
        await systemEventSender.Send(systemEvent);

        return Unit.Value;
    }
}