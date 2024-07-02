namespace Fibertest30.Infrastructure.Device;

public static class AnalyseTraceMappingExtensions
{
    public static OtdrMeasEngine.AnalysisParameters ToEngine(this OtdrTraceAnalysisParameters native)
    {
        return new OtdrMeasEngine.AnalysisParameters(
            ReflectanceThreshold: native.EventReflectanceThreshold,
            LossThreshold: native.EventLossThreshold,
            EndOfFiberThreshold: native.EndOfFiberThreshold,
            AttenuationThreshold: null); // TODO: find out why we are not using this threshold
    }
}
