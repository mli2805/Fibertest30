using MediatR;

namespace Fibertest30.Application;

public record GetNetworkSettingsQuery() : IRequest<NetworkSettings>;

public class GetNetworkSettingsQueryHandler : IRequestHandler<GetNetworkSettingsQuery, NetworkSettings>
{
    private readonly INetworkSettingsProvider _networkSettingsProvider;

    public GetNetworkSettingsQueryHandler(INetworkSettingsProvider networkSettingsProvider)
    {
        _networkSettingsProvider = networkSettingsProvider;
    }

    public Task<NetworkSettings> Handle(GetNetworkSettingsQuery request, CancellationToken cancellationToken)
    {
        return _networkSettingsProvider.GetNetworkSettings(cancellationToken);
    }
}
