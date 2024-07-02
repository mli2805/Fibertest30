using System.Text.Json;

namespace Fibertest30.Application;

public static class OtauParametersFactory
{
    public static IOtauParameters Create(OtauType type, string jsonData)
    {
        return type switch
        {
            OtauType.Ocm => Deserialize<OcmOtauParameters>(jsonData),
            OtauType.Osm => Deserialize<OsmOtauParameters>(jsonData),
            OtauType.Oxc => Deserialize<OxcOtauParameters>(jsonData),
            _ => throw new ArgumentException("OtauParametersFactory: Invalid OtauType", nameof(type))
        };
    }
    
    private static IOtauParameters Deserialize<T>(string jsonData) where T : IOtauParameters
    {
        return JsonSerializer.Deserialize<T>(jsonData)!;
    }
}