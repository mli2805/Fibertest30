using MediatR;

namespace Fibertest30.Application;

public record StopOnDemandCommand(string onDemandId) : IRequest<Unit>;

public class StopOnDemandCommandHandler : IRequestHandler<StopOnDemandCommand, Unit>
{
    private readonly IOnDemandService _onDemandService;
    private readonly ICurrentUserService _currentUserService;

    public StopOnDemandCommandHandler(IOnDemandService onDemandService,  
        ICurrentUserService currentUserService)
    {
        _onDemandService = onDemandService;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(StopOnDemandCommand request, CancellationToken cancellationToken)
    {
        await _onDemandService.CancelTask(request.onDemandId, 
            _currentUserService.UserId!,
            cancellationToken);
        return Unit.Value;
    }
}