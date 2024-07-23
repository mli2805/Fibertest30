using Iit.Fibertest.Dto;
using System.Text.Json;

namespace Fibertest30.Application;

public class RtuConnectionCheckedData : ISystemEventData
{
    NetAddress NetAddress { get; init; }
    bool IsSuccessful { get; init; }

    public RtuConnectionCheckedData(RtuConnectionCheckedDto dto)
    {
        NetAddress = dto.NetAddress;
        IsSuccessful = dto.IsConnectionSuccessfull;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}
