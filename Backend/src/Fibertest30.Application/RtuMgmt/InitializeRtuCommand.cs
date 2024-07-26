using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record InitializeRtuCommand(InitializeRtuDto dto) : IRequest<RtuInitializedDto>;

public class InitializeRtuCommandHandler : IRequestHandler<InitializeRtuCommand, RtuInitializedDto>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IRtuManager _rtuManager;

    public InitializeRtuCommandHandler(ICurrentUserService currentUserService, IRtuManager rtuManager)
    {
        _currentUserService = currentUserService;
        _rtuManager = rtuManager;
    }

    public async Task<RtuInitializedDto> Handle(InitializeRtuCommand request, CancellationToken cancellationToken)
    {
        var rtuInitializedDto = await _rtuManager.InitializeRtuAsync(request.dto);

        return rtuInitializedDto;
    }
}
