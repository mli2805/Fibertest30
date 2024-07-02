using Microsoft.Extensions.Options;
using Optixsoft.SorExaminer;
using Optixsoft.SorExaminer.OtdrDataFormat;
using Fibertest30.Infrastructure.Device.OtdrMeasEngine;
using System.Runtime.CompilerServices;

namespace Fibertest30.Infrastructure.Device;

public class Otdr : IOtdr
{
    private readonly OtdrSettings _settings;
    private readonly OtdrMeasEngine.OtdrMeasEngine _otdrMeasEngine;
    private readonly IDeviceInfoProvider _deviceInfoProvider;
    private volatile bool _cancelMeasurement = false;
    private object _locker = new object();
    private bool _isConnected = false;
    private OtdrProductInfo _productInfo;
    private Application.OtdrMeasurementParameterSet _supportedMeasurementParameters = 
        new Application.OtdrMeasurementParameterSet();

    public Otdr(
        IOptions<OtdrSettings> settings,
        OtdrMeasEngine.OtdrMeasEngine otdrMeasEngine,
        IDeviceInfoProvider deviceInfoProvider)
    {
        _settings = settings.Value.Validate();
        _otdrMeasEngine = otdrMeasEngine;
        _deviceInfoProvider = deviceInfoProvider;

        // TODO: this should probably not be here
        // TODO: make it reconnect in a loop or something?
        // TODO: log OtdrMeasEngine.GetInfo() result once for debug purposes
        Connect().Wait();
    }

    private OtdrConnectionParameters CreateConnectionParameters()
    {
        var connectionParameters = _settings.ConnectionParameters;
        if (connectionParameters?.Use != nameof(connectionParameters.Usb) && connectionParameters?.Tcp is { } tcp)
        {
            return new TcpOtdrConnectionParameters(Host: tcp.Host!, Port: tcp.Port);
        }
        return new UsbOtdrConnectionParameters();
    }


    public bool SupportMeasureByBaseline => true;

    public bool IsConnected
    { 
        get
        { 
            lock(_locker)
            {
                return _isConnected;
            } 
        } 
    }

    public OtdrProductInfo OtdrProductInfo
    {
        get
        {
            lock(_locker) 
            {
                return _productInfo;
            }
        }
    }

    public Application.OtdrMeasurementParameterSet SupportedMeasurementParameters
    {
        get
        {
            lock(_locker)
            {
                return _supportedMeasurementParameters;
            }
        }
    }

    public async Task SetOpticalLineTopology(OpticalLineTopology opticalLineTopology)
    {
        await Connect();
        try
        {
            await _otdrMeasEngine.SetOpticalLineProperties(opticalLineTopology.ToEngine());
        }
        catch
        {
            OnDisconnected();
            throw;
        }
    }

    public async Task<OpticalLineAnalysisResult> AnalyseOpticalLine(Application.Laser laser, bool forceSingleVscout)
    {
        await Connect();
        try
        {
            await _otdrMeasEngine.SetLaser(laser.ToEngine());
            var analysisResponse = await _otdrMeasEngine.AnalyseOpticalLine();
            var vscoutResponse = await _otdrMeasEngine.PrepareVscout(
                new OtdrMeasEngine.PrepareVscoutRequest(ForceSingleTraceAquisition: forceSingleVscout));
            var result = analysisResponse.FromEngine();
            result.VscoutCount = vscoutResponse.VscoutCount;
            return result;
        }
        catch
        {
            OnDisconnected();
            throw;
        }
    }

    public async Task ForceOpticalLineLMax(int lmax)
    {
        await Connect();
        try
        {
            await _otdrMeasEngine.ForceOpticalLineLmax(lmax);
        }
        catch
        {
            OnDisconnected();
            throw;
        }
    }

    public async IAsyncEnumerable<OtdrTraceMeasurementResult> Measure(
        byte[] reference,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        _cancelMeasurement = false;

        await Connect();
        try
        {
            await Set(reference);
        }
        catch
        {
            OnDisconnected();
            throw;
        }

        var sorData = reference.ToSorData();
        var analysisParameters = GetAnalysisParameters(sorData);
        var spanParameters = new OtdrTraceSpanParameters()
        {
            BeginningEventIndex = 0,
            EndEventIndex = -1,
            IncludeBeginningEventLoss = false,
            IncludeEndEventLoss = false
        };

        bool liveMode = false;
        bool skipMeasurement = false;
        int? maxIntermediateTracePointCount = null;
        bool forcePhotodiodeTuning = true;
        await foreach (var item in MeasureImpl(
            liveMode, skipMeasurement, analysisParameters, spanParameters,
            maxIntermediateTracePointCount, forcePhotodiodeTuning, cancellationToken))
        {
            yield return item;
        }
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

        await Connect();
        try
        {
            await Set(fiberParameters);
            await Set(manualParameters);
        }
        catch
        {
            OnDisconnected();
            throw;
        }

        bool skipMeasurement = false;
        int? maxIntermediateTracePointCount = manualParameters.MaxPointCountForIntermediateTrace;
        bool forcePhotodiodeTuning = true;
        await foreach (var item in MeasureImpl(
            liveMode, skipMeasurement, analysisParameters, spanParameters,
            maxIntermediateTracePointCount, forcePhotodiodeTuning, cancellationToken))
        {
            yield return item;
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
        _cancelMeasurement = false;

        await Connect();
        try
        {
            await Set(fiberParameters);
            bool applied = await Set(vscoutParameters);
            if (!applied)
            {
                yield break;
            }
            // TODO: Originally we called OtdrMeasEngine.SetMinAveragingScale() if skipMeasurement=true,
            //       to make OtdrMeasEngine.AbortTraceAcquisition() faster, since it still calls
            //       one wait/load_points cycle inside measXXX.dll which may take several seconds by default.
            //       But as it turned out, OtdrMeasEngine.SetMinAveragingScale() resets to MANUAL mode.
            //       Therefore we removed the call to OtdrMeasEngine.SetMinAveragingScale() if skipMeasurement=true,
            //       until the problem will be solved at OtdrMeasEngine level.
            //       The problem is similar to the forcePhotodiodeTuning problem below.
        }
        catch
        {
            OnDisconnected();
            throw;
        }

        int? maxIntermediateTracePointCount = null;

        // TODO: In iit_otdr it calls SERVICE_CMD_SETPARAM(SERVICE_CMD_PARAM_FORCE_APD_TUNING)
        //       and SERVICE_CMD_SETPARAM resets to MANUAL measurement mode,
        //       even if there was AUTO/VSCOUT parameters applied (SERVICE_CMD_APPLY_LINKSCAN_PARAM_I).
        //       So we avoid calling this in AUTO/VSCOUT mode now as a quick fix,
        //       but should probably solve this to somehow allow forcing APD
        //       tuning in all modes.
        bool forcePhotodiodeTuning = false;

        await foreach (var item in MeasureImpl(
            liveMode, skipMeasurement, analysisParameters, spanParameters,
            maxIntermediateTracePointCount, forcePhotodiodeTuning, cancellationToken))
        {
            yield return item;
        }
    }

    private async Task<byte[]?> StartTraceAcquisition(
        bool liveMode,
        bool returnInitialTrace,
        int? maxIntermediateTracePointCount,
        bool forcePhotodiodeTuning)
    {
        OtdrMeasEngine.StartTraceAcquisitionResponse startResponse;
        try
        {
            var startRequest = new OtdrMeasEngine.StartTraceAcquisitionRequest(
                IsLiveMode: liveMode,
                ReturnInitialTrace: returnInitialTrace,
                MaxIntermediateTracePointsCount: maxIntermediateTracePointCount,
                ForcePhotodiodeTuning: forcePhotodiodeTuning);
            startResponse = await _otdrMeasEngine.StartTraceAcquisition(startRequest);
        }
        catch
        {
            OnDisconnected();
            throw;
        }

        return returnInitialTrace ? startResponse.Trace : null;
    }

    private async IAsyncEnumerable<OtdrMeasEngine.NextTraceAcquisitionStepResponse> LoopTraceAcquisition(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        bool measurementEnded = false;
        while (!measurementEnded && !_cancelMeasurement && !cancellationToken.IsCancellationRequested)
        {
            OtdrMeasEngine.NextTraceAcquisitionStepResponse stepResponse;
            try
            {
                var stepRequest = new OtdrMeasEngine.NextTraceAcquisitionStepRequest(ReturnIntermediateTrace: true, ReturnFinalTrace: true);
                stepResponse = await _otdrMeasEngine.NextTraceAcquisitionStep(stepRequest);
            }
            catch
            {
                OnDisconnected();
                throw;
            }
            yield return stepResponse;
            measurementEnded = stepResponse.Finished;
        }
    }

    private async Task AbortTraceAcquisition()
    {
        try
        {
            await _otdrMeasEngine.AbortTraceAcquisition();
        }
        catch
        {
            OnDisconnected();
            throw;
        }
    }

    private async Task<byte[]> AnalyseTrace(
        byte[] trace,
        OtdrTraceAnalysisParameters analysisParameters)
    {
        try
        {
            var analysisRequest = new OtdrMeasEngine.AnalyseTraceRequest(
                AnalysisParameters: analysisParameters.ToEngine(),
                Trace: trace);
            var analysisResult = await _otdrMeasEngine.AnalyseTrace(analysisRequest);
            return analysisResult.Trace;
        }
        catch
        {
            OnDisconnected();
            throw;
        }
    }

    private async IAsyncEnumerable<OtdrTraceMeasurementResult> MeasureImpl(
        bool liveMode,
        bool skipMeasurement,
        OtdrTraceAnalysisParameters analysisParameters,
        OtdrTraceSpanParameters spanParameters,
        int? maxIntermediateTracePointCount,
        bool forcePhotodiodeTuning,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        // TODO: implement span

        byte[]? initialTrace = await StartTraceAcquisition(liveMode, skipMeasurement, maxIntermediateTracePointCount, forcePhotodiodeTuning);
        if (initialTrace != null)
        {
            yield return new OtdrTraceMeasurementResult { Progress = 0, Sor = initialTrace };
        }

        bool measurementEnded = false;
        if (!skipMeasurement)
        {
            await foreach (var itResult in LoopTraceAcquisition(cancellationToken))
            {
                var trace = itResult.Trace;
                if (itResult.Finished && itResult.Trace != null)
                {
                    trace = await AnalyseTrace(itResult.Trace, analysisParameters);
                }
                yield return new OtdrTraceMeasurementResult() { Progress = itResult.Progress ?? 0.0, Sor = trace };
                if (itResult.Finished)
                {
                    measurementEnded = true;
                    break;
                }
            }
        }

        if (!measurementEnded)
        {
            await AbortTraceAcquisition();
        }
    }

    public Task CancelMeasurement()
    {
        _cancelMeasurement = true;
        return Task.CompletedTask;
    }

    private async Task Connect()
    {
        // TODO: possible race here, if two clients call Connect simultaneously
        lock (_locker)
        {
            if (_isConnected) return;
        }

        var connectRequest = new OtdrMeasEngine.ConnectOtdrRequest(OtdrConnectionParameters: CreateConnectionParameters());
        var connectResponse = await _otdrMeasEngine.ConnectOtdr(connectRequest);

        await PresetSorFields();

        OnConnected(connectResponse);
    }

    private void OnConnected(OtdrMeasEngine.ConnectOtdrResponse engineResponse)
    {
        lock (_locker)
        {
            _isConnected = true;
            _productInfo = engineResponse.OtdrInfo.FromEngine();
            _supportedMeasurementParameters = engineResponse.OtdrMeasurementParameterSet.FromEngine();
        }
    }

    private void OnDisconnected()
    {
        lock (_locker) 
        { 
            _isConnected = false;
        }
    }

    private async Task PresetSorFields()
    {
        await _otdrMeasEngine.PresetSorFields(
            new OtdrMeasEngine.PresetSorFieldsRequest(_deviceInfoProvider.GetSerialNumber()));
    }

    private async Task Set(OtdrTraceFiberParameters fiberParameters)
    {
        await _otdrMeasEngine.SetRefractiveIndex(fiberParameters.RefractiveIndex);
        await _otdrMeasEngine.SetBackscatterCoefficient(fiberParameters.BackscatterCoefficient);
    }

    private async Task Set(OtdrTraceManualMeasurementParameters manualParameters)
    {
        await _otdrMeasEngine.SetLaser(manualParameters.Laser.ToEngine());

        if (manualParameters.CustomDistanceRange != null)
        {
            await _otdrMeasEngine.SetDistanceRange(manualParameters.CustomDistanceRange.Value);
        }
        else if (manualParameters.DistanceRange != null) 
        {
            await _otdrMeasEngine.SetDistanceRange(manualParameters.DistanceRange);
        }

        if (manualParameters.CustomPulseDuration != null)
        {
            await _otdrMeasEngine.SetPulseDuration(manualParameters.CustomPulseDuration.Value);
        }
        else if (manualParameters.PulseDuration != null)
        {
            await _otdrMeasEngine.SetPulseDuration(manualParameters.PulseDuration);
        }

        if (manualParameters.AveragingTime != null)
        {
            await _otdrMeasEngine.SetAveragingTime(manualParameters.AveragingTime); 
        }

        if (manualParameters.LiveAveragingTime != null)
        {
            await _otdrMeasEngine.SetAveragingTime(manualParameters.LiveAveragingTime);
        }

        if (manualParameters.Resolution != null)
        {
            await _otdrMeasEngine.SetResolution(manualParameters.Resolution);   
        }

        await _otdrMeasEngine.SetHighResolutionOptimization(manualParameters.PreferDZOverDR);
    }

    private async Task<bool> Set(OtdrTraceVscoutMeasurementParameters vscoutParameters)
    {
        await _otdrMeasEngine.SetLaser(vscoutParameters.Laser.ToEngine());

        var result = await _otdrMeasEngine.ApplyVscoutTraceAcquisitionParameters(vscoutParameters.VscoutIndex);
        return result.VscoutApplied;
    }

    private async Task Set(byte[] sor)
    {
        await _otdrMeasEngine.SetParametersFromSor(sor);
    }

    private OtdrTraceAnalysisParameters GetAnalysisParameters(OtdrDataKnownBlocks sor)
    {
        return new OtdrTraceAnalysisParameters()
        {
            EventReflectanceThreshold = sor.FixedParameters.ReflectanceThreshold,
            EventLossThreshold = sor.FixedParameters.EventLossThreshold,
            EndOfFiberThreshold = sor.FixedParameters.EndOfFiberThreshold
        };
    }
}