using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure.Device;

public class NtpSettingsProvider : INtpSettingsProvider
{
    private readonly IShellCommand _shellCommand;
    private readonly ILogger<INetworkSettingsProvider> _logger;
    private NtpSettings? _ntpSettings;

    public NtpSettingsProvider(IShellCommand shellCommand, ILogger<INetworkSettingsProvider> logger)
    {
        _shellCommand = shellCommand;
        _logger = logger;
    }

    public Task<NtpSettings> GetNtpSettings(CancellationToken ct)
    {
        if (_ntpSettings == null)
        {
            _ntpSettings = new NtpSettings();
            var output = _shellCommand.GetCommandLineOutput(SystemSettingsCommandFactory.GetNtpServers());
            _logger.LogInformation($"ntpserver.sh returns: {output}");
            var ntpServers = output.Split('\n').ToList();
            if (ntpServers.Count > 0) _ntpSettings.PrimaryNtpServer = ntpServers[0].Trim();
            if (ntpServers.Count > 1) _ntpSettings.SecondaryNtpServer = ntpServers[1].Trim();
        }

        return Task.FromResult(_ntpSettings);
    }

    public Task UpdateNtpSettings(NtpSettings settings, CancellationToken ct)
    {
        string output = _shellCommand.GetCommandLineOutput(SystemSettingsCommandFactory.GetNtpServers());
        _logger.LogInformation($"ntpserver.sh returns: {output}");
        List<string> ntpServers = output.Split('\n').ToList();
        foreach (string ntpServer in ntpServers)
        {
            if (!string.IsNullOrEmpty(ntpServer.Trim()))
            {
                string command = SystemSettingsCommandFactory.DelNtpServer(ntpServer.Trim());
                _logger.LogInformation(command);
                string _ = _shellCommand.GetCommandLineOutput(command);
            }
        }

        if (!string.IsNullOrEmpty(settings.PrimaryNtpServer))
        {
            string _ = _shellCommand.GetCommandLineOutput(SystemSettingsCommandFactory.AddNtpServer(settings.PrimaryNtpServer));
        }

        if (!string.IsNullOrEmpty(settings.SecondaryNtpServer))
        {
            string _ = _shellCommand.GetCommandLineOutput(SystemSettingsCommandFactory.AddNtpServer(settings.SecondaryNtpServer));
        }

        _ntpSettings = settings;

        return Task.CompletedTask;
    }
}