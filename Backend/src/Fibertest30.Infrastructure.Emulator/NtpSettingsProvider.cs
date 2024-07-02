namespace Fibertest30.Infrastructure.Emulator;

public class NtpSettingsProvider : INtpSettingsProvider
{
    private NtpSettings? _ntpSettings;

    public Task<NtpSettings> GetNtpSettings(CancellationToken ct)
    {
        if (_ntpSettings == null)
        {
            _ntpSettings = new NtpSettings()
            {
            
                PrimaryNtpServer = "0.debian.pool.ntp.org",
                SecondaryNtpServer = null,
            };
        }
        

        return Task.FromResult(_ntpSettings);
    }

    public async Task UpdateNtpSettings(NtpSettings settings, CancellationToken ct)
    {
        await Task.Delay(200, ct);
        _ntpSettings = settings;
    }
}