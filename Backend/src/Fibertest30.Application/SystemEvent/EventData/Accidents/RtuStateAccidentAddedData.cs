using System.Text.Json;

namespace Fibertest30.Application;

// accident может относиться к RTU в целом, а может к трассе на этом RTU поэтому ObjTitle/ObjId
public record RtuStateAccidentAddedData(int EventId,
    DateTime RegisteredAt, string ObjTitle, string ObjId, string RtuId, bool IsOk) : ISystemEventData
{
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}