using MediatR;

namespace Fibertest30.Api;

public class PlatformService : Platform.PlatformBase
{
    private readonly ILogger<PlatformService> _logger;
    private readonly ISender _mediator;

    public PlatformService(ILogger<PlatformService> logger, ISender mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }


}