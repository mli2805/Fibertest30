using System.Text.Json;
using System.Text.Json.Serialization;

namespace Fibertest30.Infrastructure;

public static class JsonSerializerEx
{
    public static JsonSerializerOptions SerializerOptions { get; } = new()
    {
        Converters = { new JsonStringEnumConverter() }
    };

    public static JsonSerializerOptions SerializerOptionsForWeb { get; } = new()
    {
        // use camelCase props in JSON when send to the client
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters = { new JsonStringEnumConverter() }
    };
}