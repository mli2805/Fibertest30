using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record InitializeRtuCommand(InitializeRtuDto Dto) : IRequest<RtuInitializedDto>;

public class InitializeRtuCommandHandler(ICurrentUserService currentUserService, IRtuManager rtuManager,
        ISystemEventSender systemEventSender, Model writeModel)
    : IRequestHandler<InitializeRtuCommand, RtuInitializedDto>
{
    public async Task<RtuInitializedDto> Handle(InitializeRtuCommand request, CancellationToken cancellationToken)
    {
        var rtuInitializedDto = await rtuManager.InitializeRtuAsync(request.Dto);

        var rtu = writeModel.Rtus.First(r => r.Id == rtuInitializedDto.RtuId);
        SystemEvent systemEvent = SystemEventFactory.RtuInitialized(currentUserService.UserId!, rtuInitializedDto, rtu.Title);
        await systemEventSender.Send(systemEvent);

        return rtuInitializedDto;
    }
}
