using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record DetachOtauCommand(DetachOtauDto Dto) : IRequest<Unit>;

public class DetachOtauCommandHandler : IRequestHandler<DetachOtauCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IRtuManager _rtuManager;
    private readonly ISystemEventSender _systemEventSender;
    private readonly Model _writeModel;

    public DetachOtauCommandHandler(ICurrentUserService currentUserService, IRtuManager rtuManager,
        ISystemEventSender systemEventSender, Model writeModel)
    {
        _currentUserService = currentUserService;
        _rtuManager = rtuManager;
        _systemEventSender = systemEventSender;
        _writeModel = writeModel;
    }

    public async Task<Unit> Handle(DetachOtauCommand request, CancellationToken cancellationToken)
    {
        var result = await _rtuManager.DetachOtau(request.Dto);

        if (result.ReturnCode == ReturnCode.OtauDetachedSuccessfully)
        {
            var rtu = _writeModel.Rtus.First(r => r.Id == request.Dto.RtuId);

            var systemEvent = SystemEventFactory
                .OtauDetached(_currentUserService.UserId!, request.Dto.NetAddress.ToStringA(), rtu.Id);
            await _systemEventSender.Send(systemEvent);
        }

        return Unit.Value;
    }
}
