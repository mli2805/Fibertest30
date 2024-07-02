using Fibertest30.Infrastructure.Device.OtdrMeasEngine;

namespace Fibertest30.Infrastructure.Device;
public static class ThresholdMappingExtensions
{
    private static double? getMinorValue(Application.Threshold threshold)
    {
        return threshold.IsMinorOn ? threshold.Minor : null;
    }

    private static double? getMajorValue(Application.Threshold threshold)
    {
        return threshold.IsMajorOn ? threshold.Major : null;
    }

    private static double? getCriticalValue(Application.Threshold threshold)
    {
        return threshold.IsCriticalOn ? threshold.Critical : null;
    }

    private static double? getOrNull(
        List<Application.Threshold> thresholds, ThresholdParameter param, Func<Application.Threshold, double?> getter)
    {
        var threshold = thresholds.Find(t => t.Parameter == param);
        return threshold == null ? null : getter(threshold);
    }

    private static ThresholdsLevel ToOtdrMeasEngine(
        AlarmProfile alarmProfile, string name, Func<Application.Threshold, double?> getter)
    {
        return new ThresholdsLevel()
        {
            Name = name,
            Thresholds = new Thresholds()
            {
                EventLoss = getOrNull(alarmProfile.Thresholds, ThresholdParameter.EventLoss, getter),
                EventReflectance = getOrNull(alarmProfile.Thresholds, ThresholdParameter.EventReflectance, getter),
                EventLeadingLossCoefficient = getOrNull(alarmProfile.Thresholds, ThresholdParameter.SectionAttenuation, getter),
            }
        };
    }

    public static List<ThresholdsLevel> ToOtdrMeasEngine(this AlarmProfile app)
    {
        return new List<ThresholdsLevel>()
        {
            ToOtdrMeasEngine(app, "critical", getCriticalValue),
            ToOtdrMeasEngine(app, "major", getMajorValue),
            ToOtdrMeasEngine(app, "minor", getMinorValue),
        };
    }
}
