namespace Fibertest30.Application;

public static class MonitoringAlarmExtensions
{
    public static ThresholdParameter? ToThresholdParameter(this MonitoringAlarmType type)
    {
        return type switch
        {
            MonitoringAlarmType.EventLoss => ThresholdParameter.EventLoss,
            MonitoringAlarmType.TotalLoss => ThresholdParameter.TotalLoss,
            MonitoringAlarmType.EventReflectance => ThresholdParameter.EventReflectance,
            MonitoringAlarmType.SectionAttenuation => ThresholdParameter.SectionAttenuation,
            MonitoringAlarmType.SectionLoss => ThresholdParameter.SectionLoss,
            MonitoringAlarmType.SectionLengthChange => ThresholdParameter.SectionLengthChange,
            MonitoringAlarmType.PortHealth => ThresholdParameter.PortHealth,
            _ => null
        };
    }
}