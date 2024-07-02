namespace Fibertest30.Infrastructure.Device;
public static class TraceAcquisitionStepMappingExtensions
{
    public static OtdrTraceMeasurementResult FromEngine(this OtdrMeasEngine.NextTraceAcquisitionStepResponse engine)
    {
        return new()
        {
            Sor = engine.Trace,
            Progress = engine.Progress ?? 0.0
        };
    }
}
