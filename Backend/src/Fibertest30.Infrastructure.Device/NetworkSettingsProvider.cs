using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure.Device;

public class NetworkSettingsProvider : INetworkSettingsProvider
{
    private readonly IShellCommand _shellCommand;
    private readonly ILogger<INetworkSettingsProvider> _logger;
    private NetworkSettings? _networkSettings;

    public NetworkSettingsProvider(IShellCommand shellCommand, ILogger<INetworkSettingsProvider> logger)
    {
        _shellCommand = shellCommand;
        _logger = logger;
    }

    public Task<NetworkSettings> GetNetworkSettings(CancellationToken ct)
    {
        if (_networkSettings == null)
        {
            var output = _shellCommand.GetCommandLineOutput(SystemSettingsCommandFactory.GetIpSettings());
            _networkSettings = NetworkSettingsParser.Parse(output);
        }

        return Task.FromResult(_networkSettings);
    }

    public Task UpdateNetworkSettings(NetworkSettings settings, CancellationToken ct)
    {
        UpdateAddressIfChanged(settings);

        UpdateDnsIfChanged(settings);

        return Task.CompletedTask;
    }

    private void UpdateDnsIfChanged(NetworkSettings settings)
    {
        if (_networkSettings!.PrimaryDnsServer != settings.PrimaryDnsServer
            || _networkSettings.SecondaryDnsServer != settings.SecondaryDnsServer)
        {
            var mode = settings.NetworkMode == "IPV6" ? "ipv6" : "";
            string command = SystemSettingsCommandFactory.UpdateDnsServers(mode, settings.PrimaryDnsServer, settings.SecondaryDnsServer);
            var isDnsOn = !string.IsNullOrEmpty(settings.PrimaryDnsServer);

            _logger.LogInformation($"Command: {command}");
            var output = _shellCommand.GetCommandLineOutput(command);
            _logger.LogInformation($"Rfts400config returns: {output}");

            if (output.Contains("Configure successfully! Please reboot the unit to take effect!"))
            {
                _logger.LogInformation("DNS servers applied successfully!");

                _networkSettings.PrimaryDnsServer = settings.PrimaryDnsServer;
                _networkSettings.SecondaryDnsServer = settings.SecondaryDnsServer;
            }

            if (isDnsOn)
            {
                command = SystemSettingsCommandFactory.EnableDns(mode);
                output = _shellCommand.GetCommandLineOutput(command);
                _logger.LogInformation($"Rfts400config returns: {output}");
            }
        }
    }

    private void UpdateAddressIfChanged(NetworkSettings settings)
    {
        if (_networkSettings!.LocalIpAddress != settings.LocalIpAddress
            || _networkSettings.LocalSubnetMask != settings.LocalSubnetMask
            || _networkSettings.LocalGatewayIp != settings.LocalGatewayIp)
        {

            // if (SendIpAddressCommand(settings, true))
            //     SendIpAddressCommand(settings, false);

            SendIpAddressCommand(settings, false);
        }
    }

    private bool SendIpAddressCommand(NetworkSettings settings, bool untilReboot)
    {
        var mode = settings.NetworkMode == "IPV6" ? "ipv6" : "";
        var command = SystemSettingsCommandFactory
            .UpdateIpSettings(mode, settings.LocalIpAddress!, settings.LocalSubnetMask!, settings.LocalGatewayIp!, untilReboot);
        var output = _shellCommand.GetCommandLineOutput(command);
        _logger.LogInformation($"Rfts400config returns: {output}");

        if (output.Contains("Configure successfully!"))
        {
            _logger.LogInformation("Address/mask/gateway applied successfully!");

            _networkSettings!.LocalIpAddress = settings.LocalIpAddress;
            _networkSettings.LocalSubnetMask = settings.LocalSubnetMask;
            _networkSettings.LocalGatewayIp = settings.LocalGatewayIp;

            return true;
        }
        return false;
    }
}