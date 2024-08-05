using Google.Protobuf.WellKnownTypes;
using System.Text.Json;

namespace Fibertest30.Api;

public static class MonitoringMappingExtensions
{
  

   
    public static MonitoringResult ToProto(this Fibertest30.Application.MonitoringResult monitoringResult)
    {
        var result = new MonitoringResult()
        {
            Id = monitoringResult.Id,
            CompletedAt = new Timestamp
            {
                Seconds = monitoringResult.CompletedAt
            },
            MonitoringPortId = monitoringResult.MonitoringPortId,
            BaselineId = monitoringResult.BaselineId,
            ChangesCount = monitoringResult.ChangesCount,
        };

        if (result.ChangesCount > 0)
        {
            result.MostSevereChangeLevel = monitoringResult.MostSevereChangeLevel!.Value.ToProto();
        }
        
        if (monitoringResult.MeasurementSettings != null)
        {
            result.MeasurementSettings = monitoringResult.MeasurementSettings.ToProto();
        }

        if (monitoringResult.Changes != null)
        {
            result.JsonChanges =
                JsonSerializer.Serialize(monitoringResult.Changes, JsonSerializerEx.SerializerOptionsForWeb);
        }

        return result;
    }

    public static MonitoringBaseline ToProto(this Fibertest30.Application.MonitoringBaseline baseline)
    {
        return new MonitoringBaseline()
        {
            Id = baseline.Id,
            MonitoringPortId = baseline.MonitoringPortId,
            CreatedAt = baseline.CreatedAt.ToTimestamp(),
            CreatedByUserId = baseline.CreatedByUserId,
            MeasurementSettings = baseline.MeasurementSettings.ToProto()
        };
    }

   

   
}