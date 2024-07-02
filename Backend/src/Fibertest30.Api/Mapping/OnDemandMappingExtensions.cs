
namespace Fibertest30.Api;

public static class OnDemandMappingExtensions
{
    public static CompletedOnDemand ToProto(this Fibertest30.Application.CompletedOnDemand onDemand)
    {
        return new CompletedOnDemand()
        {
            Id = onDemand.Id,
            CreatedByUserId = onDemand.CreatedByUserId,
            CompletedAt = onDemand.CompletedAt.ToTimestamp(),
            MonitoringPortId = onDemand.MonitoringPortId,

            MeasurementSettings = onDemand.MeasurementSettings.ToProto()
        };
    }
}