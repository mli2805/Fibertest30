using MediatR;

namespace Fibertest30.Application;

public record UpdateNetworkSettingsCommand(NetworkSettings NetworkSettings) : IRequest<Unit>;

public class UpdateNetworkSettingsCommandHandler : IRequestHandler<UpdateNetworkSettingsCommand, Unit>
{
    private readonly INetworkSettingsProvider _networkSettingsProvider;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public UpdateNetworkSettingsCommandHandler(INetworkSettingsProvider networkSettingsProvider, 
        ISystemEventSender systemEventSender, ICurrentUserService currentUserService)
    {
        _networkSettingsProvider = networkSettingsProvider;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateNetworkSettingsCommand request, CancellationToken cancellationToken)
    {
        await _networkSettingsProvider.UpdateNetworkSettings(request.NetworkSettings, cancellationToken);

        await _systemEventSender.Send(SystemEventFactory.NetworkSettingsUpdated(_currentUserService.UserId!, request.NetworkSettings));

        return Unit.Value;
    }
}
