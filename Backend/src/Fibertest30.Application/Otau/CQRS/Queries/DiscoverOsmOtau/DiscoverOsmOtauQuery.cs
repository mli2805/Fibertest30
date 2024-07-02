using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ConfigureOtau)]
public record DiscoverOsmOtauQuery(int ChainAddress) : IRequest<OtauDiscoverResult>;

public class DiscoverOsmOtauQueryHandler : IRequestHandler<DiscoverOsmOtauQuery, OtauDiscoverResult>
{
    private readonly IOtauService _otauService;

    public DiscoverOsmOtauQueryHandler(IOtauService otauService)
    {
        _otauService = otauService;
    }

    public async Task<OtauDiscoverResult> Handle(DiscoverOsmOtauQuery request, CancellationToken ct)
    {
        return await _otauService.DiscoverOsmOtau(request.ChainAddress, ct);
    }
}