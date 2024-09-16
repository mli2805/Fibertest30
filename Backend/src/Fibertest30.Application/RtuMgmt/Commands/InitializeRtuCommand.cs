using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record InitializeRtuCommand(InitializeRtuDto Dto) : IRequest<RtuInitializedDto>;

public class InitializeRtuCommandHandler : IRequestHandler<InitializeRtuCommand, RtuInitializedDto>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IRtuManager _rtuManager;
    private readonly ISystemEventSender _systemEventSender;
    private readonly Model _writeModel;

    public InitializeRtuCommandHandler(ICurrentUserService currentUserService, IRtuManager rtuManager,
        ISystemEventSender systemEventSender, Model writeModel)
    {
        _currentUserService = currentUserService;
        _rtuManager = rtuManager;
        _systemEventSender = systemEventSender;
        _writeModel = writeModel;
    }

    public async Task<RtuInitializedDto> Handle(InitializeRtuCommand request, CancellationToken cancellationToken)
    {
        var rtuInitializedDto = await _rtuManager.InitializeRtuAsync(request.Dto);

        var rtu = _writeModel.Rtus.First(r => r.Id == rtuInitializedDto.RtuId);
        SystemEvent systemEvent = SystemEventFactory.RtuInitialized(_currentUserService.UserId!, rtuInitializedDto, rtu.Title);
        await _systemEventSender.Send(systemEvent);

        return rtuInitializedDto;
    }
}
