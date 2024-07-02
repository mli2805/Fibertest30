using System.Text.Json;

namespace Fibertest30.Application;

public class UnsupportedOsmModuleConnectedData : ISystemEventData
{
    public int OcmPortIndex { get; init; }

    public UnsupportedOsmModuleConnectedData(int ocmPortIndex)
    {
        OcmPortIndex = ocmPortIndex;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}