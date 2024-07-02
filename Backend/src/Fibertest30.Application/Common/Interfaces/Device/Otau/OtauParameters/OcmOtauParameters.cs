namespace Fibertest30.Application;
using System.Text.Json;


public class OcmOtauParameters : IOtauParameters
{
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}