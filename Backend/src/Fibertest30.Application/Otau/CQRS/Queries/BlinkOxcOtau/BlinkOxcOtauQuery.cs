using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ConfigureOtau)]
public record BlinkOxcOtauQuery(string IpAddress, int Port) : IRequest<bool>;

public class BlinkOxcOtauQueryHandler : IRequestHandler<BlinkOxcOtauQuery, bool>
{
    private readonly IOtauService _otauService;

    public BlinkOxcOtauQueryHandler(IOtauService otauService)
    {
        _otauService = otauService;
    }

    public async Task<bool> Handle(BlinkOxcOtauQuery request, CancellationToken ct)
    {
        return await _otauService.BlinkOxcOtau(request.IpAddress, request.Port, ct);
    }
}