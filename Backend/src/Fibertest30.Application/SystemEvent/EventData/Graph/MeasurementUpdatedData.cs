using System.Text.Json;

namespace Fibertest30.Application
{
    public class MeasurementUpdatedData(int sorFileId) : ISystemEventData
    {
        public int SorFileId { get; } = sorFileId;

        public string ToJsonData()
        {
            return JsonSerializer.Serialize(this);
        }
    }
}
