using Google.Protobuf.WellKnownTypes;
using System.Text.Json;

namespace Fibertest30.Api;

public static class MonitoringMappingExtensions
{
    public static Application.AlarmProfile FromProto(this AlarmProfile profile)
    {
        return new Fibertest30.Application.AlarmProfile()
        {
            Id = profile.Id, Name = profile.Name, Thresholds =  profile.Thresholds.Select(t => t.FromProto()).ToList() 
        };
    }

    private static Application.Threshold FromProto(this Threshold threshold)
    {
        return new Application.Threshold()
        {
            Id = threshold.Id,
            Parameter = threshold.Parameter.FromProto(),
            IsMinorOn = threshold.IsMinorOn,
            IsMajorOn = threshold.IsMajorOn,
            IsCriticalOn = threshold.IsCriticalOn,
            Minor = threshold.Minor,
            Major = threshold.Major,
            Critical = threshold.Critical,
        };
    }

    private static Application.ThresholdParameter FromProto(this ThresholdParameter parameter)
    {
        switch (parameter)
        {
            case ThresholdParameter.EventLoss: return Application.ThresholdParameter.EventLoss;
            case ThresholdParameter.TotalLoss: return Application.ThresholdParameter.TotalLoss;
            case ThresholdParameter.EventReflectance: return Application.ThresholdParameter.EventReflectance;
            case ThresholdParameter.SectionAttenuation: return Application.ThresholdParameter.SectionAttenuation;
            case ThresholdParameter.SectionLoss: return Application.ThresholdParameter.SectionLoss;
            case ThresholdParameter.SectionLengthChange: return Application.ThresholdParameter.SectionLengthChange;
            case ThresholdParameter.PortHealth: return Application.ThresholdParameter.PortHealth;
        }

        throw new ArgumentOutOfRangeException();
    }

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

    public static Threshold ToProto(this Fibertest30.Application.Threshold threshold)
    {
        Threshold protoThreshold = new Threshold()
        {
            Id = threshold.Id,
            Parameter = threshold.Parameter switch
            {
                Application.ThresholdParameter.EventLoss => ThresholdParameter.EventLoss,
                Application.ThresholdParameter.TotalLoss => ThresholdParameter.TotalLoss,
                Application.ThresholdParameter.EventReflectance => ThresholdParameter.EventReflectance,
                Application.ThresholdParameter.SectionAttenuation => ThresholdParameter.SectionAttenuation,
                Application.ThresholdParameter.SectionLoss => ThresholdParameter.SectionLoss,
                Application.ThresholdParameter.SectionLengthChange => ThresholdParameter.SectionLengthChange,
                Application.ThresholdParameter.PortHealth => ThresholdParameter.PortHealth,
                _ => throw new ArgumentOutOfRangeException()
            },
            IsMinorOn = threshold.IsMinorOn,
            IsMajorOn = threshold.IsMajorOn,
            IsCriticalOn = threshold.IsCriticalOn
        };
        if (threshold.Minor != null) protoThreshold.Minor = (double)threshold.Minor;
        if (threshold.Major != null) protoThreshold.Major = (double)threshold.Major;
        if (threshold.Critical != null) protoThreshold.Critical = (double)threshold.Critical;

        return protoThreshold;
    }

    public static AlarmProfile ToProto(this Fibertest30.Application.AlarmProfile alarmProfile)
    {
        return new AlarmProfile()
        {
            Id = alarmProfile.Id,
            Name = alarmProfile.Name,
            Thresholds = { alarmProfile.Thresholds.Select(ToProto) }
        };
    }
}