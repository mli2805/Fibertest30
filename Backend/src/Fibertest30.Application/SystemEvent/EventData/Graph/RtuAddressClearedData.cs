﻿using System.Text.Json;

namespace Fibertest30.Application;

public class RtuAddressClearedData(string rtuId) : ISystemEventData
{
    public string RtuId { get; init; } = rtuId;

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}