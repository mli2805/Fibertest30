using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record DetachTraceCommand(Guid TraceId, string ClientIp) : IRequest<Unit>;

public class DetachTraceCommandHandler(
    ICurrentUserService currentUserService,
    IRtuManager rtuManager,
    ISystemEventSender systemEventSender,
    Model writeModel)
    : IRequestHandler<DetachTraceCommand, Unit>
{
    public async Task<Unit> Handle(DetachTraceCommand request, CancellationToken cancellationToken)
    {
        var result = await rtuManager.DetachTrace(request.TraceId, request.ClientIp);
        if (result.ReturnCode != ReturnCode.Ok)
            throw new InvalidOperationException(result.ErrorMessage);

        var trace = writeModel.Traces.Single(t => t.TraceId == request.TraceId);

        SystemEvent systemEvent =
            SystemEventFactory.TraceDetached(currentUserService.UserId!, request.TraceId, trace.Title, trace.RtuId.ToString());
        await systemEventSender.Send(systemEvent);

        return Unit.Value;
    }
}

