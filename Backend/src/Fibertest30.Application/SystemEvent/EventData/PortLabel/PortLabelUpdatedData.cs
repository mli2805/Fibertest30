using System.Text.Json;

namespace Fibertest30.Application;

public class PortLabelUpdatedData : ISystemEventData
{
    public PortLabelData OldPortLabel { get; set; }
    public PortLabelData NewPortLabel { get; set; }
    
    public PortLabelUpdatedData(PortLabelData oldPortLabel, PortLabelData newPortLabel)
    {
        OldPortLabel = oldPortLabel;
        NewPortLabel = newPortLabel;
    }

    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}