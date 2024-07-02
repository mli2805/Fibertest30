using System.Text.Json;

namespace Fibertest30.Application;

public class OtauChangedData : ISystemEventData
{
    public int OtauId { get; init; }
    public string OldSerialNumber { get; set; }
    public string NewSerialNumber { get; set; }
    public int? OldPortCount { get; set; }
    public int? NewPortCount { get; set; }

    public OtauChangedData(
        int otauId,
        string oldSerialNumber, string newSerialNumber,
        int? oldPortCount, int? newPortCount)
    {
        OtauId = otauId;
        OldSerialNumber = oldSerialNumber;
        NewSerialNumber = newSerialNumber;
        if (oldPortCount != null && newPortCount != null && oldPortCount != newPortCount)
        {
            OldPortCount = oldPortCount;
            NewPortCount = newPortCount;
        }
        else
        {
            OldPortCount = NewPortCount = null;
        }
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}