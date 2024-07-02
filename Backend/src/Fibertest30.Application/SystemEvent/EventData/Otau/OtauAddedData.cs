using System.Text.Json;

namespace Fibertest30.Application;

public class OtauAddedData : ISystemEventData
{
    public int OtauId { get; init; }
    public int OcmPortIndex { get; init; }
    public string OtauType { get; init; }
    public string SerialNumber { get; init;  }
    public int PortCount { get; init; }

    public OtauAddedData(int otauId, int ocmPortIndex, string otauType, string serialNumber, int portCount)
    {
        OtauId = otauId;
        OcmPortIndex = ocmPortIndex;
        OtauType = otauType;
        SerialNumber = serialNumber;
        PortCount = portCount;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}