using System.Runtime.CompilerServices;
using System.Text.Json;

namespace Fibertest30.Infrastructure.Emulator;
public class Otdr : IOtdr
{
    private readonly EmulatorSsePublisher _ssePublisher;
    private readonly IEmulatorDelayService _delayService;
    private readonly OtdrEmulatorProvider _emulatorProvider = new();
    private volatile bool _cancelMeasurement;
    private readonly List<OtdrTraceMeasurementResult> _measurementSteps;

    public Otdr(EmulatorSsePublisher ssePublisher, IEmulatorDelayService delayService)
    {
        _ssePublisher = ssePublisher;
        _delayService = delayService;

        (OtdrProductInfo, SupportedMeasurementParameters) = _emulatorProvider.GetParameters();
        _measurementSteps = _emulatorProvider.GetMeasurementSteps();
    }

    public bool SupportMeasureByBaseline => false;
    public OtdrProductInfo OtdrProductInfo { get; }

    public OtdrMeasurementParameterSet SupportedMeasurementParameters { get; }

    public Task SetOpticalLineTopology(OpticalLineTopology opticalLineTopology)
    {
        return Task.CompletedTask; 
    }

    public async Task<OpticalLineAnalysisResult> AnalyseOpticalLine(Laser laser, bool forceSingleVscout)
    {
        // if (!forceSingleVscout)
        // {
        //     // For this implementation we need to change OtdrEmulatorProvider to actually support VScout
        //     throw new NotImplementedException("Only AUTO mode (single VSCOUT iteration) is supported");
        // }
        await _delayService.EmulateDelay(1000, CancellationToken.None);
        return new OpticalLineAnalysisResult() { VscoutCount = 1, LMax = 100, Snr = 0 };
    }

    public Task ForceOpticalLineLMax(int lmax)
    {
        throw new NotImplementedException();
    }

    public IAsyncEnumerable<OtdrTraceMeasurementResult> Measure(
        byte[] reference, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async IAsyncEnumerable<OtdrTraceMeasurementResult> Measure(
        bool liveMode,
        OtdrTraceFiberParameters fiberParameters,
        OtdrTraceAnalysisParameters analysisParameters,
        OtdrTraceSpanParameters spanParameters,
        OtdrTraceManualMeasurementParameters manualParameters,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        _cancelMeasurement = false;

        var delayBetweenStepsMs = 300;
        var normalizedMeasurementSteps = new MeasurementStepsNormalizer()
            .Normalize(_measurementSteps, delayBetweenStepsMs, liveMode, manualParameters);

        foreach (var measurementStep in normalizedMeasurementSteps)  
        {

            // if (i > 40) { throw new Exception("OTDR: Something went wrong!"); }
            await Task.Delay(delayBetweenStepsMs, CancellationToken.None);
            if (_cancelMeasurement || cancellationToken.IsCancellationRequested)
            {
                await _ssePublisher.SendSeeUpdate(JsonSerializer.Serialize(new
                {
                    Type = "Otdr", Action = OtdrAction.MeasureCancelled.ToString()
                }));
                break;
            }
            yield return measurementStep;
            
            await _ssePublisher.SendSeeUpdate(JsonSerializer.Serialize(new        {
                Type = "Otdr",
                Action = OtdrAction.MeasureProgress.ToString(),
                Parameters = new
                {
                    Progress = measurementStep.Progress,
                    Laser = manualParameters.Laser.LaserUnit,
                    DistanceRange = manualParameters.DistanceRange,
                    Pulse = manualParameters.PulseDuration,
                    Resolution = manualParameters.Resolution,
                    AveragingTime = manualParameters.AveragingTime
                }
            }));
        }
    }

    public async IAsyncEnumerable<OtdrTraceMeasurementResult> Measure(
        bool liveMode,
        bool skipMeasurement,
        OtdrTraceFiberParameters fiberParameters,
        OtdrTraceAnalysisParameters analysisParameters,
        OtdrTraceSpanParameters spanParameters,
        OtdrTraceVscoutMeasurementParameters vscoutParameters,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        if (vscoutParameters.VscoutIndex != 0)
        {
            throw new NotImplementedException("Only AUTO mode (single VSCOUT iteration) is supported");
        }

        _cancelMeasurement = false;

        var lineAnalysisDelay = 500;

        await _delayService.EmulateDelay(lineAnalysisDelay, cancellationToken);

        if (skipMeasurement)
        {
            yield return _measurementSteps[0];
            yield break;
        }

        var delayBetweenStepsMs = 300;
        var totalTimeMs = 5000;
        var normalizedMeasurementSteps = liveMode ? 
            _measurementSteps.TakeLast(1).ToList() : 
            new MeasurementStepsNormalizer()
                .Normalize(_measurementSteps, delayBetweenStepsMs, totalTimeMs);

        foreach (var measurementStep in normalizedMeasurementSteps)
        {

            // if (i > 40) { throw new Exception("OTDR: Something went wrong!"); }
            await Task.Delay(delayBetweenStepsMs, cancellationToken);
            if (_cancelMeasurement || cancellationToken.IsCancellationRequested)
            {
                await _ssePublisher.SendSeeUpdate(JsonSerializer.Serialize(new
                {
                    Type = "Otdr",
                    Action = OtdrAction.MeasureCancelled.ToString()
                }));
                break;
            }
            yield return measurementStep;

            await _ssePublisher.SendSeeUpdate(JsonSerializer.Serialize(new
            {
                Type = "Otdr",
                Action = OtdrAction.MeasureProgress.ToString(),
                Parameters = new
                {
                    Progress = measurementStep.Progress,
                    Laser = vscoutParameters.Laser.LaserUnit
                }
            }));
        }
    }

    public Task CancelMeasurement()
    {
        _cancelMeasurement = true;
        return Task.CompletedTask;
    }
}
