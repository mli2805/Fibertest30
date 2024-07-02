namespace Fibertest30.Application;
using System.Text.Json;

public class OsmOtauParameters : IOtauParameters
{
    public int ChainAddress { get; init; }
    
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }

    public OsmOtauParameters(int chainAddress)
    {
        ChainAddress = chainAddress;
    }
}