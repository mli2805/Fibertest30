namespace Fibertest30.Application;

using System.Text.Json;

public class OxcOtauParameters : IOtauParameters
{
    public string Ip { get; init; }
    public int Port { get; init; }
    
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }

    public OxcOtauParameters(string ip, int port)
    {
        Ip = ip;
        Port = port;
    }
}