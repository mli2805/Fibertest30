namespace Fibertest30.Application;

public interface IOtdr
{
    bool SupportMeasureByBaseline { get; } // used to avoid implementing Measure(baseline..) method for Emulator

    OtdrProductInfo OtdrProductInfo { get; }

    OtdrMeasurementParameterSet SupportedMeasurementParameters { get; }


    Task SetOpticalLineTopology(OpticalLineTopology opticalLineTopology);


    Task<OpticalLineAnalysisResult> AnalyseOpticalLine(Laser laser, bool forceSingleVscout);

    Task ForceOpticalLineLMax(int lmax);


    IAsyncEnumerable<OtdrTraceMeasurementResult> Measure(
        byte[] reference, 
        CancellationToken cancellationToken = default);

    IAsyncEnumerable<OtdrTraceMeasurementResult> Measure(
        bool liveMode,
        OtdrTraceFiberParameters fiberParameters,
        OtdrTraceAnalysisParameters analysisParameters,
        OtdrTraceSpanParameters spanParameters,
        OtdrTraceManualMeasurementParameters manualParameters,
        CancellationToken cancellationToken = default);

    IAsyncEnumerable<OtdrTraceMeasurementResult> Measure(
        bool liveMode,
        bool skipMeasurement,
        OtdrTraceFiberParameters fiberParameters,
        OtdrTraceAnalysisParameters analysisParameters,
        OtdrTraceSpanParameters spanParameters,
        OtdrTraceVscoutMeasurementParameters vscoutParameters,
        CancellationToken cancellationToken = default);

    Task CancelMeasurement();
}
