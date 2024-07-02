namespace Fibertest30.Application;

public class Threshold
{
    public int Id { get; init; }
    public ThresholdParameter Parameter { get; init; }

    public bool IsMinorOn { get; set; }
    public double? Minor { get; set; }
    public bool IsMajorOn { get; set; }
    public double? Major { get; set; }
    public bool IsCriticalOn { get; set; }
    public double? Critical { get; set; }


    public Threshold() { }

    public Threshold(ThresholdParameter parameter, double? minor, double? major, double? critical)
    {
        Parameter = parameter;
        Minor = minor;
        Major = major;
        Critical = critical;
    }
}