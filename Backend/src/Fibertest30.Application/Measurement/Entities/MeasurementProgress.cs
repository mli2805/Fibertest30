namespace Fibertest30.Application;

public record MeasurementProgress(double Progress, MeasurementTrace? Trace, string StepName = "");