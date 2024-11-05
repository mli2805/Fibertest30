using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record AttachTraceCommand(AttachTraceDto Dto) : IRequest<Unit>;

public class AttachTraceCommandHandler : IRequestHandler<AttachTraceCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IRtuManager _rtuManager;
    private readonly ISystemEventSender _systemEventSender;
    private readonly Model _writeModel;

    public AttachTraceCommandHandler(ICurrentUserService currentUserService, IRtuManager rtuManager,
        ISystemEventSender systemEventSender, Model writeModel)
    {
        _currentUserService = currentUserService;
        _rtuManager = rtuManager;
        _systemEventSender = systemEventSender;
        _writeModel = writeModel;
    }

    public async Task<Unit> Handle(AttachTraceCommand request, CancellationToken cancellationToken)
    {
        var result = await _rtuManager.AttachTrace(request.Dto);

        if (result.ReturnCode == ReturnCode.Ok)
        {
            var trace = _writeModel.Traces.First(t => t.TraceId == request.Dto.TraceId);
            var rtu = _writeModel.Rtus.First(r => r.Id == trace.RtuId);

            var systemEvent = SystemEventFactory.TraceAttached(_currentUserService.UserId!, trace.TraceId, trace.Title,
                request.Dto.OtauPortDto.ToStringB(), rtu.Id, rtu.Title);
            await _systemEventSender.Send(systemEvent);
        }

        return Unit.Value;
    }
}
