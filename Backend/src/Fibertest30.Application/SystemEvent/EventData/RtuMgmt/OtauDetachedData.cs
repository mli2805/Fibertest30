using System.Text.Json;

namespace Fibertest30.Application;

public class OtauDetachedData : ISystemEventData
{
    public string OtauAddress { get; set; }
    public string RtuId { get; set; }
    public OtauDetachedData(string otauAddress, string rtuId)
    {
        OtauAddress = otauAddress;
        RtuId = rtuId;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}