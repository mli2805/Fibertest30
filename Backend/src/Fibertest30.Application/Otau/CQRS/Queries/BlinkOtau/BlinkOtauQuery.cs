using MediatR;

namespace Fibertest30.Application;

public record BlinkOtauQuery(int OtauId) : IRequest<bool>;

public class BlinkOtauQueryHandler : IRequestHandler<BlinkOtauQuery, bool>
{
    private readonly IOtauService _otauService;

    public BlinkOtauQueryHandler(IOtauService otauService)
    {
        _otauService = otauService;
    }

    public async Task<bool> Handle(BlinkOtauQuery request, CancellationToken ct)
    {
        return await _otauService.BlinkOtau(request.OtauId, ct);
    }
}