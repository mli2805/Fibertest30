using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ConfigureOtau)]
public record BlinkOsmOtauQuery(int ChainAddress) : IRequest<bool>;

public class BlinkOsmOtauQueryHandler : IRequestHandler<BlinkOsmOtauQuery, bool>
{
    private readonly IOtauService _otauService;

    public BlinkOsmOtauQueryHandler(IOtauService otauService)
    {
        _otauService = otauService;
    }

    public async Task<bool> Handle(BlinkOsmOtauQuery request, CancellationToken ct)
    {
        return await _otauService.BlinkOsmOtau(request.ChainAddress, ct);
    }
}