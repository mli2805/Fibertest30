using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeMonitoringPortSettings)]
public record StartBaselineSetupCommand(int MonitoringPortId, 
    bool FullAutoMode,
    MeasurementSettings? MeasurementSettings) : IRequest<string>;

public class StartBaselineSetupCommandHandler : IRequestHandler<StartBaselineSetupCommand, string>
{
    private readonly IBaselineSetupService _baselineSetupService;
    private readonly ICurrentUserService _currentUserService;

    public StartBaselineSetupCommandHandler(
        IBaselineSetupService baselineSetupService, 
        ICurrentUserService currentUserService)
    {
        _baselineSetupService = baselineSetupService;
        _currentUserService = currentUserService;
    }

    public Task<string> Handle(StartBaselineSetupCommand request, CancellationToken cancellationToken)
    {
        return _baselineSetupService.StartBaselineSetup(
            request.MonitoringPortId,
            request.FullAutoMode,
            request.MeasurementSettings,
            _currentUserService.UserId!, 
            cancellationToken);
    }
}