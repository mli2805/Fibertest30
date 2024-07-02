using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure.Emulator;
public class NetworkSettingsProvider : INetworkSettingsProvider
{
    private readonly ILogger<INetworkSettingsProvider> _logger;
    private NetworkSettings? _networkSettings;

    public NetworkSettingsProvider(ILogger<INetworkSettingsProvider> logger)
    {
        _logger = logger;
    }

    public Task<NetworkSettings> GetNetworkSettings(CancellationToken ct)
    {
        if (_networkSettings == null)
        {
            _networkSettings = new NetworkSettings()
            {
                NetworkMode = "IPV4",
                LocalIpAddress = "192.168.96.222",
                LocalSubnetMask = "255.255.255.128",
                LocalGatewayIp = "192.168.96.3",

                PrimaryDnsServer = "8.8.8.8",
                SecondaryDnsServer = null,
            };
        }

        return Task.FromResult(_networkSettings);
    }

    public async Task UpdateNetworkSettings(NetworkSettings settings, CancellationToken ct)
    {
        await Task.Delay(1000, ct);
        _networkSettings = settings;
        _logger.LogInformation("Network settings applied successfully!");
    }
}
