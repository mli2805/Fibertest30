namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public enum ValueExactness { Exact, AtLeast, AtMost }

public record QualifiedValue(double Value, ValueExactness Exactness);
