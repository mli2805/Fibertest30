﻿using System.Text.Json;

namespace Fibertest30.Application;
public class TraceCleanedData(string traceId) : ISystemEventData
{
    public string TraceId { get; init; } = traceId;

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}