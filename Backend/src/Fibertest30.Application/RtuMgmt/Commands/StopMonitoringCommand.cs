using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record StopMonitoringCommand(Guid RtuId, string ClientIp) : IRequest<Unit>;

public class StopMonitoringCommandHandler(
    IRtuManager rtuManager,
    ICurrentUserService currentUserService,
    ISystemEventSender systemEventSender)
    : IRequestHandler<StopMonitoringCommand, Unit>
{
    public async Task<Unit> Handle(StopMonitoringCommand request, CancellationToken ct)
    {
        var result = await rtuManager.StopMonitoring(request.RtuId, request.ClientIp);

        SystemEvent systemEvent = SystemEventFactory.MonitoringStopped(currentUserService.UserId!, request.RtuId, result.ReturnCode == ReturnCode.Ok);
        await systemEventSender.Send(systemEvent);

        // успешный результат придет в системном событии, чтобы все клиенты обработали его одинаково
        // проблемы во время исполнения должны дать кастомный exception, который пославший клиент покажет как сообщение об ошибке
        return Unit.Value; 
    }
}
