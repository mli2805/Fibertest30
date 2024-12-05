using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record AttachOtauCommand(AttachOtauDto Dto) : IRequest<Unit>;

public class AttachOtauCommandHandler : IRequestHandler<AttachOtauCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IRtuManager _rtuManager;
    private readonly ISystemEventSender _systemEventSender;
    private readonly Model _writeModel;

    public AttachOtauCommandHandler(ICurrentUserService currentUserService, IRtuManager rtuManager,
        ISystemEventSender systemEventSender, Model writeModel)
    {
        _currentUserService = currentUserService;
        _rtuManager = rtuManager;
        _systemEventSender = systemEventSender;
        _writeModel = writeModel;
    }

    public async Task<Unit> Handle(AttachOtauCommand request, CancellationToken cancellationToken)
    {
        var result = await _rtuManager.AttachOtau(request.Dto);

        if (result.ReturnCode == ReturnCode.OtauAttachedSuccessfully)
        {
            var rtu = _writeModel.Rtus.First(r => r.Id == request.Dto.RtuId);
            var systemEvent = SystemEventFactory.OtauAttached(_currentUserService.UserId!,
                request.Dto.NetAddress.ToStringA(), result.Serial, request.Dto.OpticalPort, rtu.Id, rtu.Title);
            await _systemEventSender.Send(systemEvent);
        }

        return Unit.Value;

    }
}

