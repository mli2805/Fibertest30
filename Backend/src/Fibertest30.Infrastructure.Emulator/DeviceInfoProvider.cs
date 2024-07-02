
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure.Emulator;

public class DeviceInfoProvider : IDeviceInfoProvider
{
    private readonly ILogger<DeviceInfoProvider> _logger;
    private TimeZoneInfo? _overrideTimeZone = null;
    
    private string? _ipV4Address = null;

    public DeviceInfoProvider(IConfiguration configuration, ILogger<DeviceInfoProvider> logger)
    {
        _logger = logger;
        InitOverrideTimeZone(configuration);
    }
    
    private void InitOverrideTimeZone(IConfiguration configuration)
    {
        var timeZoneSerializedString = configuration.GetValue<string>("Emulator:TimeZoneSerializedString");
        if (string.IsNullOrEmpty(timeZoneSerializedString)) { return; }

        try
        {
            _overrideTimeZone = TimeZoneInfo.FromSerializedString(timeZoneSerializedString);
            _logger.LogInformation("Timezone is applied from configuration: {TimeZoneSerializedString}", timeZoneSerializedString);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to deserialize timezone from configuration: {TimeZoneSerializedString}", timeZoneSerializedString);
        }
    }
    
    
    public string GetSerialNumber()
    {
        // ReSharper disable once StringLiteralTypo
        return "TZNA02WA123456";
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
        if (_overrideTimeZone != null)
        {
            return _overrideTimeZone;
        }
        
        return TimeZoneInfo.Local;
    }

    public void UpdateTimeZone(AppTimeZone timeZone)
    {
        var newTimeZone = timeZone.FromAppTimeZone();
        if (!newTimeZone.Equals(_overrideTimeZone))
        {
            _overrideTimeZone = newTimeZone;
        }
    }
}