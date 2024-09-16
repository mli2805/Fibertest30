using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record StopMonitoringCommand(Guid RtuId) : IRequest<Unit>;

public class StopMonitoringCommandHandler : IRequestHandler<StopMonitoringCommand, Unit>
{
    private readonly IRtuManager _rtuManager;
    private readonly ICurrentUserService _currentUserService;
    private readonly ISystemEventSender _systemEventSender;

    public StopMonitoringCommandHandler(IRtuManager rtuManager, ICurrentUserService currentUserService,
        ISystemEventSender systemEventSender)
    {
        _rtuManager = rtuManager;
        _currentUserService = currentUserService;
        _systemEventSender = systemEventSender;
    }

    public async Task<Unit> Handle(StopMonitoringCommand request, CancellationToken ct)
    {
        var result = await _rtuManager.StopMonitoring(request.RtuId);

        SystemEvent systemEvent = SystemEventFactory.MonitoringStopped(_currentUserService.UserId!, request.RtuId, result.ReturnCode == ReturnCode.Ok);
        await _systemEventSender.Send(systemEvent);

        // успешный результат придет в системном событии, чтобы все клиенты обработали его одинаково
        // проблемы во время исполнения должны дать кастомный exception, который пославший клиент покажет как сообщение об ошибке
        return Unit.Value; 
    }
}
