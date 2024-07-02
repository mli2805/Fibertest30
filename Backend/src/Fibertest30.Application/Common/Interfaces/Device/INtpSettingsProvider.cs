namespace Fibertest30.Application;

public interface INtpSettingsProvider
{
    public Task<NtpSettings> GetNtpSettings(CancellationToken ct);
    public Task UpdateNtpSettings(NtpSettings settings, CancellationToken ct);
}