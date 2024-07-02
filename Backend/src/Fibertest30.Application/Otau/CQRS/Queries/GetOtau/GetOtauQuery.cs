using MediatR;

namespace Fibertest30.Application;

public record GetOtauQuery(int OtauId) : IRequest<CombinedOtau>;

public class GetOtauQueryHandler : IRequestHandler<GetOtauQuery, CombinedOtau>
{
    private readonly IOtauService _otauService;

    public GetOtauQueryHandler(IOtauService otauService)
    {
        _otauService = otauService;
    }

    public async Task<CombinedOtau> Handle(GetOtauQuery request, CancellationToken cancellationToken)
    {
        return await _otauService.GetOtau(request.OtauId, cancellationToken);
    }
}