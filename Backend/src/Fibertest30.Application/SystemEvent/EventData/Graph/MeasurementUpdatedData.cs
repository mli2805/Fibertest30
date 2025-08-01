using Iit.Fibertest.Dto;
using System.Text.Json;

namespace Fibertest30.Application
{
    public class MeasurementUpdatedData(int sorFileId, EventStatus eventStatus ) : ISystemEventData
    {
        public int SorFileId { get; } = sorFileId;
        public EventStatus EventStatus { get; } = eventStatus;

        public string ToJsonData()
        {
            return JsonSerializer.Serialize(this);
        }
    }
}
