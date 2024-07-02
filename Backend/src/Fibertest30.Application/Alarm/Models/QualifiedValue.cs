namespace Fibertest30.Application;

public enum ValueExactness { Exact, AtLeast, AtMost }
public record QualifiedValue(double Value, ValueExactness Exactness);