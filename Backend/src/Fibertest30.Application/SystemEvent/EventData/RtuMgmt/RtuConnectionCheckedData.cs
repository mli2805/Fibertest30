using Iit.Fibertest.Dto;
using System.Text.Json;

namespace Fibertest30.Application;

public class RtuConnectionCheckedData : ISystemEventData
{
    public string Address { get; init; }
    public bool IsSuccessful { get; init; }

    public RtuConnectionCheckedData(string address, bool isSuccessful)
    {
        Address = address;
        IsSuccessful = isSuccessful;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}