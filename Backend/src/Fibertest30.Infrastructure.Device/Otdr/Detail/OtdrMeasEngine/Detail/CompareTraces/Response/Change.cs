namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public class Change
{
    public ChangeType ChangeType { get; init; }

    public Threshold? ExceededThreshold { get; init; }
    public double? ExceededThresholdValue { get; init; }
    public QualifiedValue? ExceedingValue { get; init; }

    public double? ChangeLocation { get; init; }
    public double? LocationThreshold { get; init; }

    public int? CurrentEventIndex { get; init; }
    public QualifiedValue? CurrentEventLoss { get; init; }
    public QualifiedValue? CurrentEventReflectance { get; init; }
    public QualifiedValue? CurrentEventLeadingLossCoefficient { get; init; }
    //public QualifiedValue? CurrentEventMaxLevel { get; init; }

    public int? ReferenceEventIndex { get; init; }
    public QualifiedValue? ReferenceEventLoss { get; init; }
    public QualifiedValue? ReferenceEventReflectance { get; init; }
    public QualifiedValue? ReferenceEventLeadingLossCoefficient { get; init; }
    //public QualifiedValue? ReferenceEventMaxLevel { get; init; }

    public string? ReferenceEventComment { get; init; }

    public bool? ReferenceEventMapsToCurrentEvents { get; init; }
}
