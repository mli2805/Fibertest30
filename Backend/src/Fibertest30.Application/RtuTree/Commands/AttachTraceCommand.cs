using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record AttachTraceCommand(AttachTraceDto Dto) : IRequest<Unit>;

public class AttachTraceCommandHandler(
    ICurrentUserService currentUserService,
    IRtuManager rtuManager,
    ISystemEventSender systemEventSender,
    Model writeModel)
    : IRequestHandler<AttachTraceCommand, Unit>
{
    public async Task<Unit> Handle(AttachTraceCommand request, CancellationToken cancellationToken)
    {
        var result = await rtuManager.AttachTrace(request.Dto);

        if (result.ReturnCode == ReturnCode.Ok)
        {
            var trace = writeModel.Traces.First(t => t.TraceId == request.Dto.TraceId);
            var rtu = writeModel.Rtus.First(r => r.Id == trace.RtuId);

            var systemEvent = SystemEventFactory.TraceAttached(currentUserService.UserId!, trace.TraceId, trace.Title, trace.State,
                request.Dto.OtauPortDto.ToStringB(), rtu.Id, rtu.Title);
            await systemEventSender.Send(systemEvent);
        }

        return Unit.Value;
    }
}
