using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record DetachTraceCommand(Guid TraceId) : IRequest<Unit>;

public class DetachTraceCommandHandler : IRequestHandler<DetachTraceCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IRtuManager _rtuManager;
    private readonly ISystemEventSender _systemEventSender;
    private readonly Model _writeModel;

    public DetachTraceCommandHandler(ICurrentUserService currentUserService, IRtuManager rtuManager,
        ISystemEventSender systemEventSender, Model writeModel)
    {
        _currentUserService = currentUserService;
        _rtuManager = rtuManager;
        _systemEventSender = systemEventSender;
        _writeModel = writeModel;
    }

    public async Task<Unit> Handle(DetachTraceCommand request, CancellationToken cancellationToken)
    {
        var result = await _rtuManager.DetachTrace(request.TraceId);
        if (result.ReturnCode != ReturnCode.Ok)
            throw new InvalidOperationException();

        var trace = _writeModel.Traces.Single(t => t.TraceId == request.TraceId);

        SystemEvent systemEvent =
            SystemEventFactory.TraceDetached(_currentUserService.UserId!, request.TraceId, trace.Title, trace.RtuId.ToString());
        await _systemEventSender.Send(systemEvent);

        return Unit.Value;
    }
}

