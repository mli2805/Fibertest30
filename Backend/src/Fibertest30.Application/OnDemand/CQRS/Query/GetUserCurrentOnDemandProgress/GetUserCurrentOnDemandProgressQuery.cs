using MediatR;

namespace Fibertest30.Application;

public record GetUserCurrentOnDemandProgressQuery() : IRequest<OtdrTaskProgressData?>;

public class GetUserCurrentOnDemandProgressQueryHandler : IRequestHandler<GetUserCurrentOnDemandProgressQuery, OtdrTaskProgressData?>
{
    private readonly IOnDemandService _onDemandService;
    private readonly ICurrentUserService _currentUserService;

    public GetUserCurrentOnDemandProgressQueryHandler(IOnDemandService onDemandService, 
        ICurrentUserService currentUserService)
    {
        _onDemandService = onDemandService;
        _currentUserService = currentUserService;
    }

    public async Task<OtdrTaskProgressData?> Handle(GetUserCurrentOnDemandProgressQuery request, CancellationToken cancellationToken)
    {
        var onDemandProgressData = await _onDemandService.GetUserCurrentOnDemandProgress(_currentUserService.UserId!);
        return  onDemandProgressData;
    }
}