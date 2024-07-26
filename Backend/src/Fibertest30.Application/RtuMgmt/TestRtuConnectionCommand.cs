using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record TestRtuConnectionCommand(NetAddress NetAddress) : IRequest<RtuConnectionCheckedDto>;

public class TestRtuConnectionCommandHandler : IRequestHandler<TestRtuConnectionCommand, RtuConnectionCheckedDto>
{
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRtuTransmitter _rtuTransmitter;

    public TestRtuConnectionCommandHandler(
        ISystemEventSender systemEventSender, ICurrentUserService currentUserService, IRtuTransmitter rtuTransmitter)
    {
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
        _rtuTransmitter = rtuTransmitter;
    }

    public async Task<RtuConnectionCheckedDto> Handle(TestRtuConnectionCommand command, CancellationToken cancellationToken)
    {
        var rtuConnectionCheckedDto = await _rtuTransmitter.CheckRtuConnection(command.NetAddress, cancellationToken);

        SystemEvent systemEvent = SystemEventFactory.RtuConnectionChecked(_currentUserService.UserId!, rtuConnectionCheckedDto);
        await _systemEventSender.Send(
            systemEvent);

        return rtuConnectionCheckedDto;
    }
}
