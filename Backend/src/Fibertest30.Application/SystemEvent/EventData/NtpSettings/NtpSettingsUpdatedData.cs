using System.Text.Json;

namespace Fibertest30.Application;

public class NtpSettingsUpdatedData : ISystemEventData
{
    public NtpSettings Settings { get; init; }

    public NtpSettingsUpdatedData(NtpSettings settings)
    {
        Settings = settings;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}