namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public record AnalysisParameters(
    double? ReflectanceThreshold,
    double? LossThreshold,
    double? AttenuationThreshold,
    double? EndOfFiberThreshold);

