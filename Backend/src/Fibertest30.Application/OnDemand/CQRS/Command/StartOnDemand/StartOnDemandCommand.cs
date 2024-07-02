using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.PerformOnDemandTest)]
public record StartOnDemandCommand(int MonitoringPortId, MeasurementSettings MeasurementSettings) : IRequest<string>;

public class StartOnDemandCommandHandler : IRequestHandler<StartOnDemandCommand, string>
{
    private readonly IOnDemandService _onDemandService;
    private readonly ICurrentUserService _currentUserService;

    public StartOnDemandCommandHandler(IOnDemandService onDemandService, 
        ICurrentUserService currentUserService)
    {
        _onDemandService = onDemandService;
        _currentUserService = currentUserService;
    }

    public async Task<string> Handle(StartOnDemandCommand request, CancellationToken cancellationToken)
    {
        var onDemandTask = await _onDemandService.StartOnDemand(
            request.MonitoringPortId,
            request.MeasurementSettings,
            _currentUserService.UserId!, 
            cancellationToken);
        return onDemandTask.Id;
    }
}