using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure.Device;

public class DeviceInfoProvider : IDeviceInfoProvider
{
    private readonly IShellCommand _shellCommand;
    private readonly ILogger<IDeviceInfoProvider> _logger;
    private string? _serialNumber = null;
    private string? _ipV4Address = null;
    private TimeZoneInfo? _timeZoneInfo;

    public DeviceInfoProvider(IShellCommand shellCommand, ILogger<IDeviceInfoProvider> logger)
    {
        _shellCommand = shellCommand;
        _logger = logger;
    }

    public string GetSerialNumber()
    {
        if (_serialNumber == null)
        {
            // ReSharper disable once StringLiteralTypo
            _serialNumber = File.ReadAllText("/tmp/e2promserv/sn");
        }

        return _serialNumber!;
    }

    public string GetIpV4Address()
    {
        if (_ipV4Address == null)
        {
            _ipV4Address = NetworkUtils.GetExternalIpAddress();
        }
        return _ipV4Address;
    }

    public TimeZoneInfo GetTimeZone()
    {
        if (_timeZoneInfo == null)
        {
            _timeZoneInfo = TimeZoneInfo.Local;
        }
        return _timeZoneInfo;
    }

    public void UpdateTimeZone(AppTimeZone timeZone)
    {
        var newTimeZoneInfo = timeZone.FromAppTimeZone();
        if (!newTimeZoneInfo.Equals(_timeZoneInfo))
        {
            //var command = $"ln -sf /usr/share/zoneinfo/{timeZone.IanaId}  /etc/localtime && echo \"{timeZone.IanaId}\" > /etc/timezone";
            var command = SystemSettingsCommandFactory.SetTimezone(timeZone.IanaId);
            _logger.LogInformation($"Command: {command}");
            var output = _shellCommand.GetCommandLineOutput(command);
            if (!string.IsNullOrEmpty(output))
            {
                _logger.LogError(output);
                return;
            }

            _timeZoneInfo = newTimeZoneInfo;
        }
    }
}