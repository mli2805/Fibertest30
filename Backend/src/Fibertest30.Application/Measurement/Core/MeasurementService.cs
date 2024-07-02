using Microsoft.Extensions.Logging;

namespace Fibertest30.Application;


public class OtauPortPath
{
    public OtauManager OcmOtauManager { get; set; } = null!;
    public OtauPort OcmOtauPort { get; set; } = null!;
    
    public OtauManager? CascadeOtauManager { get; set; }
    public OtauPort? CascadeOtauPort { get; set; } = null!;
    
    public string ToTitle(string separator = "/")
    {
        if (CascadeOtauPort == null)
        {
            return $"{OcmOtauPort.PortIndex}";
        }
        else
        {
            return $"{OcmOtauPort.PortIndex}{separator}{CascadeOtauPort.PortIndex}";
        }
    }
}

public class MeasurementService : IMeasurementService
{
    private readonly IOtdr _otdr;
    private readonly IOtauService _otauService;
    private readonly ILogger<MeasurementService> _logger;
    private volatile Measurement? _currentMeasurement;
    private volatile MeasurementProgress? _lastProgress;

    public Measurement? CurrentMeasurement
    {
        get
        {
            return _currentMeasurement;
        }
    }
    
    public MeasurementService(IOtdr otdr, IOtauService otauService, ILogger<MeasurementService> logger)
    {
        _otdr = otdr;
        _otauService = otauService;
        _logger = logger;
    }
    public async Task Measure(Measurement measurement, CancellationToken ct, bool notifyComplete = true)
    {
        _currentMeasurement = measurement;
        try
        {
            await _otauService.SetPort(measurement.MonitoringPortId, ct);

            // If we measure with reference trace, then no need to analyse optical line,
            // since all the needed line info will be taken from the reference trace.
            if (measurement.MeasurementSettings!.Baseline == null)
            {
                await _otdr.SetOpticalLineTopology(measurement.MeasurementSettings!.ToOpticalLineTopology());

                var laser = new Laser(measurement.MeasurementSettings!.Laser, null);
                var lineAnalysisResult = await _otdr.AnalyseOpticalLine(laser, measurement.MeasurementSettings.IsAuto());
            }

            await foreach (var progress in OtdrMeasure(measurement, ct))
            {
                var trace = progress.Sor != null ? new MeasurementTrace(progress.Sor) : null;
                var measurementProgress = new MeasurementProgress(progress.Progress,
                    trace, measurement.MeasurementName);
                
                _lastProgress = measurementProgress;
                measurement.NotifyProgress(measurementProgress);
            }
        }
        finally
        {
            if (notifyComplete)
            {
                measurement.NotifyComplete();
            }
            _currentMeasurement = null;
            _lastProgress = null;
        }
    }

    private IAsyncEnumerable<OtdrTraceMeasurementResult> OtdrMeasure(Measurement measurement, CancellationToken ct)
    {
        if (measurement.MeasurementSettings!.Baseline != null && _otdr.SupportMeasureByBaseline)
        {
            return _otdr.Measure(measurement.MeasurementSettings!.Baseline, ct);
        }

        var (isLive, fiberParameters, analysisParameters, spanParameters, manualParameters)
            = measurement.MeasurementSettings!.ToIOtdrMeasureParameters();
        var vscoutParameters = new OtdrTraceVscoutMeasurementParameters() { Laser = manualParameters.Laser, VscoutIndex = 0 };

        bool skipMeasurement = measurement.MeasurementSettings!.IsSkipMeasurement();
        return measurement.MeasurementSettings!.IsAuto() ?
            _otdr.Measure(isLive, skipMeasurement, fiberParameters, analysisParameters, spanParameters, vscoutParameters, ct) :
            _otdr.Measure(isLive, fiberParameters, analysisParameters, spanParameters, manualParameters, ct);
    }

    public async Task StopOtdrMeasurement(Measurement measurement)
    {
        var currentMeasurementCopy = _currentMeasurement;
        if (currentMeasurementCopy == _currentMeasurement)
        {
            await _otdr.CancelMeasurement();
        }
    }

    public MeasurementTrace? GetLastProgressSorData(Measurement measurement)
    {
        var currentMeasurementCopy = _currentMeasurement;
        var copyLastProgress = _lastProgress;
        
        if (currentMeasurementCopy == _currentMeasurement)
        {
            return copyLastProgress?.Trace;
        }
        return null;
    }
}