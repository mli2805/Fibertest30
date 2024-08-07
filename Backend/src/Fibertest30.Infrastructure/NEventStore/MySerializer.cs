﻿using Microsoft.Extensions.Logging;
using NEventStore.Serialization;
using Newtonsoft.Json;

namespace Fibertest30.Infrastructure;

public class MySerializer : ISerialize
{
    private readonly ILogger<MySerializer> _logger;

    public MySerializer(ILogger<MySerializer> logger)
    {
        _logger = logger;
    }

    public void Serialize<T>(Stream stream, T ev)
    {
        if (ev == null) throw new ArgumentNullException(nameof(ev));

        try
        {
            using var sw = new StreamWriter(stream);
            using var jsonTextWriter = new JsonTextWriter(sw);
         
            JsonSerializer serializer = JsonSerializer.Create(new JsonSerializerSettings() {TypeNameHandling = TypeNameHandling.None});
            serializer.Serialize(jsonTextWriter, ev);
        }
        catch (Exception e)
        {
            _logger.LogError( $"Event serialization exception: {e.Message}");
        }
    }

    public T? Deserialize<T>(Stream stream)
    {
        try
        {
            using var sr = new StreamReader(stream);
            using var jsonTextReader = new JsonTextReader(sr);

            JsonSerializer serializer = JsonSerializer.Create(new JsonSerializerSettings() {TypeNameHandling = TypeNameHandling.All});
            var o = serializer.Deserialize<T>(jsonTextReader);
            return o == null ? default :  o;
        }
        catch (Exception e)
        {
            _logger.LogError($"Event de-serialization exception: {e.Message}");
            return default;
        }
    }
}
