using FluentValidation;

namespace Fibertest30.Application;

public class ThresholdValidator : AbstractValidator<Threshold>
{
    public ThresholdValidator()
    {
        RuleFor(x => x).Must(ValidThreshold);
    }

    private bool ValidThreshold(Threshold? threshold)
    {
        if (threshold == null) return false;

        if (threshold.IsMinorOn && threshold.Minor != null && double.IsNaN((double)threshold.Minor)) return false;
        if (threshold.IsMajorOn && threshold.Major != null && double.IsNaN((double)threshold.Major)) return false;
        if (threshold.IsCriticalOn && threshold.Critical != null && double.IsNaN((double)threshold.Critical)) return false;

        if (threshold.IsMinorOn && threshold.IsMajorOn && threshold.Major < threshold.Minor) return false;
        if (threshold.IsMinorOn && threshold.IsCriticalOn && threshold.Critical < threshold.Minor) return false;
        if (threshold.IsMajorOn && threshold.IsCriticalOn && threshold.Critical < threshold.Major) return false;

        return true;
    }
}