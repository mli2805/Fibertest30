using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeMonitoringPortSettings)]
public record StopBaselineSetupCommand(int MonitoringPortId) : IRequest<Unit>;

public class StopBaselineSetupCommandHandler : IRequestHandler<StopBaselineSetupCommand, Unit>
{
    private readonly IBaselineSetupService _baselineSetupService;
    private readonly ICurrentUserService _currentUserService;

    public StopBaselineSetupCommandHandler(
        IBaselineSetupService baselineSetupService, 
        ICurrentUserService currentUserService)
    {
        _baselineSetupService = baselineSetupService;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(StopBaselineSetupCommand request, CancellationToken cancellationToken)
    {
        await _baselineSetupService.CancelTask(request.MonitoringPortId.ToString(), 
            _currentUserService.UserId!,
            cancellationToken);
        return Unit.Value;
    }
}