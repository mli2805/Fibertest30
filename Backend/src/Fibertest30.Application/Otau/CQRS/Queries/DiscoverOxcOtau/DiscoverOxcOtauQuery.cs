using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ConfigureOtau)]
public record DiscoverOxcOtauQuery(string IpAddress, int Port) : IRequest<OtauDiscoverResult>;

public class DiscoverOxcOtauQueryHandler : IRequestHandler<DiscoverOxcOtauQuery, OtauDiscoverResult>
{
    private readonly IOtauService _otauService;

    public DiscoverOxcOtauQueryHandler(IOtauService otauService)
    {
        _otauService = otauService;
    }

    public async Task<OtauDiscoverResult> Handle(DiscoverOxcOtauQuery request, CancellationToken ct)
    {
        return await _otauService.DiscoverOxcOtau(request.IpAddress, request.Port, ct);
    }
}