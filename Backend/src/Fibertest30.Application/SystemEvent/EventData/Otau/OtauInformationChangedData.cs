using System.Text.Json;

namespace Fibertest30.Application;

public record ChangedProperty(string PropertyName, string OldValue, string NewValue);

public class OtauInformationChangedData : ISystemEventData
{
    public int OtauId { get; init; }
    public List<ChangedProperty> ChangedProperties { get; set; }
    public OtauInformationChangedData(int otauId, List<ChangedProperty> changedProperties)
    {
        OtauId = otauId;
        ChangedProperties = changedProperties;
    }
    public string ToJsonData()
    {
        return JsonSerializer.Serialize(this);
    }
}