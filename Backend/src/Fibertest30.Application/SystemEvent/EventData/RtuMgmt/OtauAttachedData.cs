using System.Text.Json;

namespace Fibertest30.Application;

public class OtauAttachedData : ISystemEventData
{
    public string OtauAddress { get; set; }
    public string Serial { get; set; }
    public int MainCharonPort { get; set; }
    public string RtuId { get; set; }
    public string RtuTitle { get; init; }
  
    public OtauAttachedData(string otauAddress, string serial, int mainCharonPort, string rtuId, string rtuTitle)
    {
        OtauAddress = otauAddress;
        Serial = serial;
        MainCharonPort = mainCharonPort;
        RtuId = rtuId;
        RtuTitle = rtuTitle;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}