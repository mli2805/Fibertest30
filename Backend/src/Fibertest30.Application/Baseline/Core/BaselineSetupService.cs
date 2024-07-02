using Fibertest30.Domain.Utils;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Optixsoft.PortableGeometry.Extensions;
using Optixsoft.SorExaminer.DomainModel.Sor;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;

namespace Fibertest30.Application;

public enum AutoBaselineMeasurementStep
{
    Detecting,
    Fast,
}

public class BaselineSetupService : OtdrTaskService<IBaselineSetupService>, IBaselineSetupService
{
    private readonly IOtdr _otdr;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    public BaselineSetupService(
        ILogger<IBaselineSetupService> logger, 
        IDateTime dateTime, 
        IMeasurementService measurement,
        IOtdr otdr, 
        IServiceScopeFactory serviceScopeFactory,
        ISystemEventSender systemEventSender,
        IOtdrTasksService otdrTasksService
        ) 
        : base(logger, dateTime, otdrTasksService, measurement, systemEventSender)
    {
        _otdr = otdr;
        _serviceScopeFactory = serviceScopeFactory;
    }

    protected override async Task OnCompleted(OtdrTask task, CancellationToken ct)
    {
        var baselineId = await SaveBaseline(task, ct);;
        ((BaselineSetupOtdrTask)task).BaselineId = baselineId;
    }

    protected override async Task OnAfterCompleted(OtdrTask task, CancellationToken ct)
    {
        var baselineId = ((BaselineSetupOtdrTask)task).BaselineId!.Value;
        
        await _systemEventSender.Send(
            SystemEventFactory.BaselineCompleted(task.CreatedByUserId, task.Id, 
                task.Measurement.MonitoringPortId, baselineId));
    }

    protected override async Task OnFailed(OtdrTask task, string failReason, CancellationToken ct)
    {
        await _systemEventSender.Send(
            SystemEventFactory.BaselineFailed(task.CreatedByUserId, 
                task.Id, task.Measurement.MonitoringPortId, failReason));
    }

    protected override Task OnCancelled(OtdrTask task, string userId, CancellationToken ct)
    {
        return Task.CompletedTask;
    }

    protected override async Task Measure(OtdrTask task, CancellationToken ct)
    {
        if (task.Measurement.MeasurementSettings == null)
        {
            // If Measurement not set, then its fully auto baseline mode
            // get the first laser and default parameters
            var (laserName, laser) = _otdr.SupportedMeasurementParameters.GetFirstLaser();
            await MeasureAutoMode(task, laserName, laser, ct);
        } else if (task.Measurement.MeasurementSettings.MeasurementType == MeasurementType.Auto)
        {
            // If Measurement is set and MeasurementType is Auto, grab Laser, BC, RI  and thresholds from MeasurementSettings
            var laserName = task.Measurement.MeasurementSettings.Laser;
            var laser = _otdr.SupportedMeasurementParameters.GetLaserByName(laserName);
            await MeasureAutoMode(task, laserName, laser, ct,
                task.Measurement.MeasurementSettings.BackscatterCoeff,
                task.Measurement.MeasurementSettings.RefractiveIndex,
                task.Measurement.MeasurementSettings.EventLossThreshold,
                task.Measurement.MeasurementSettings.EventReflectanceThreshold,
                task.Measurement.MeasurementSettings.EndOfFiberThreshold);
        }
        else
        {
            // measure in manual mode
            await _measurement.Measure(task.Measurement, ct);
        }
    }

    private async Task MeasureAutoMode(OtdrTask task,
        string laserName, 
        OtdrMeasurementParameterSet.LaserUnitSet laser,
        CancellationToken ct,
        double? backscatterCoeff = null,
        double? refractiveIndex = null,
        double? eventLossThreshold = null,
        double? eventReflectanceThreshold = null,
        double? endOfFiberThreshold = null
        )
    {
        var firstParams = GetAutoMeasurementCommonSettings(laserName, MeasurementType.AutoSkipMeasurement,
            backscatterCoeff, refractiveIndex, eventLossThreshold, eventReflectanceThreshold, endOfFiberThreshold);
        
        _logger.LogDebug("AutoBaseline: Detecting measurement settings MonitoringPortId: {MonitoringPortId} {@MeasurementSettings}", task.MonitoringPortId, firstParams);
        
        task.Measurement.SetMeasurementSettings(firstParams, AutoBaselineMeasurementStep.Detecting.ToString()); 
        
        await _measurement.Measure(task.Measurement, ct, notifyComplete: false);
        
        var firstSor = task.Measurement!.Progress!.Trace!.SorData;
        
        _logger.LogDebug("AutoBaseline: Detecting measurement MonitoringPortId: {MonitoringPortId} " +
                         "AveragingTime [sec]: {AveragingTime} DistanceRange [km]: {DistanceRange} " +
                         "SamplingResolution [km]: {SamplingResolution} PulseWidth: {PulseWidth}", 
            task.MonitoringPortId, 
            firstSor.AveragingTime, 
            firstSor.GetTransform(Space.Owt, Space.Distance).TransformX((double)firstSor.GetDistanceRange()),
            firstSor.GetTransform(Space.Owt, Space.Distance).TransformX((double)firstSor.GetSamplingResolution()),
            firstSor.FixedParametersPulseWidth );
        
        var secondParams = GetAutoMeasurementManualSettings(laserName, laser, firstSor,
            backscatterCoeff, refractiveIndex, eventLossThreshold, eventReflectanceThreshold, endOfFiberThreshold);
        
        _logger.LogDebug("AutoBaseline: Fast measurement settings MonitoringPortId: {MonitoringPortId} {@MeasurementSettings}", task.MonitoringPortId, secondParams);
        task.Measurement.SetMeasurementSettings(secondParams, AutoBaselineMeasurementStep.Fast.ToString()); 
        await _measurement.Measure(task.Measurement, ct);
    }

    public Task<string> StartBaselineSetup(int monitoringPortId, bool fullAutoMode,
        MeasurementSettings? measurementSettings,
        string userId, CancellationToken ct)
    {
        var taskId = MonitoringPortIdToTaskId(monitoringPortId);
        
        // If task is active, do not allow to add another one for the same port
        if (_otdrTasksService.TryGetValue(taskId, out OtdrTask? _))
        {
            throw new BaselineAlreadyStartedException("Baseline setup is already active for monitoringPortId: " + monitoringPortId);
        }

        var priority = fullAutoMode ? OtdrTaskPriority.AutoTask : OtdrTaskPriority.UserTask;
        var baselineSetupOtdrTask = new BaselineSetupOtdrTask(taskId, priority, monitoringPortId,
            _dateTime.UtcNow, userId);
        if (!fullAutoMode && measurementSettings != null)
        {
            baselineSetupOtdrTask.Measurement.SetMeasurementSettings(measurementSettings);
        }
        
        StartTask(baselineSetupOtdrTask);
        return Task.FromResult(baselineSetupOtdrTask.Id);
    }

    public async Task<List<OtdrTaskProgressData>> GetAllBaselineProgress()
    {
        var result = new List<OtdrTaskProgressData>();
        foreach (var task in _otdrTasksService.GetTasksCopy().OfType<BaselineSetupOtdrTask>())
        {
            // check again right before getting observer progress
            if (_otdrTasksService.TryGetValue(task.Id, out var _))
            {
                var progress = await ObserveProgress(task.Id).Take(1).ToTask();

                var item = new OtdrTaskProgressData(
                    task.Id, task.ToTaskType(), task.MonitoringPortId, task.CreatedByUserId,
                    progress.QueuePosition, progress.Status, progress.Progress,
                    progress.CompletedAt,
                    progress.StepName);
                
                result.Add(item);
            }
        }

        return result;
    }

    public static string MonitoringPortIdToTaskId(int monitoringPortId)
    {
        // let's use monitoringPortId as taskId, so we are sure there
        // can't be two automatic tasks for the same port
        return monitoringPortId.ToString();
    }
    
    private MeasurementSettings GetAutoMeasurementCommonSettings(
        string laserName, 
        MeasurementType measurementType,
        double? backscatterCoeff,
        double? refractiveIndex,
        double? eventLossThreshold,
        double? eventReflectanceThreshold,
        double? endOfFiberThreshold)
    {
        return new MeasurementSettings
        {
            Laser = laserName,
            MeasurementType = measurementType,
            NetworkType = NetworkType.PointToPoint,
            BackscatterCoeff = backscatterCoeff ?? DefaultParameters.BackscatteringCoeff,
            RefractiveIndex = refractiveIndex ?? DefaultParameters.RefractiveIndex,
            CheckConnectionQuality = false,
            EventLossThreshold = eventLossThreshold ?? DefaultParameters.EventLossThreshold,
            EventReflectanceThreshold = eventReflectanceThreshold ?? DefaultParameters.EventReflectanceThreshold,
            EndOfFiberThreshold = endOfFiberThreshold ?? DefaultParameters.EndOfFiberThreshold,
        };
    }
    
    private MeasurementSettings GetAutoMeasurementManualSettings(string laserName, 
        OtdrMeasurementParameterSet.LaserUnitSet laser, SorData sorData,
        double? backscatterCoeff,
        double? refractiveIndex,
        double? eventLossThreshold,
        double? eventReflectanceThreshold,
        double? endOfFiberThreshold)
    {
        var sortedDistanceRanges = laser.DistanceRanges.Keys
            .Select(x => Convert.ToDouble(x))
            .OrderBy(x => x).ToList();
        
        var numericDistanceRange = SorUtils.GetFirstGreaterOrEqualDistanceRange(sorData, sortedDistanceRanges);
        var distanceRange = laser.DistanceRanges.Keys.First(x => Convert.ToDouble(x) == numericDistanceRange);

        var pulseWidth = ArrayUtils.FindClosest(
            laser.DistanceRanges[distanceRange].PulseDurations.Select(x => Convert.ToInt32(x))
            , sorData.FixedParametersPulseWidth);
        
        var settings = GetAutoMeasurementCommonSettings(laserName, MeasurementType.Manual, 
                backscatterCoeff, refractiveIndex, eventLossThreshold, eventReflectanceThreshold, endOfFiberThreshold);
        settings.DistanceRange = distanceRange;
        settings.AveragingTime = GetAutoMeasurementAveragingTime(laser.DistanceRanges[distanceRange]);
        settings.Pulse = pulseWidth.ToString();
        settings.SamplingResolution = laser.DistanceRanges[distanceRange].Resolutions.Last();
        
        return settings;
    }

    private string GetAutoMeasurementAveragingTime(OtdrMeasurementParameterSet.LaserUnitSet.DistanceRangeSet distanceRangeSet)
    {
        var averageTime30Sec = distanceRangeSet.AveragingTimes.FirstOrDefault(x => x == "00:30");
        return averageTime30Sec ?? distanceRangeSet.AveragingTimes[0];
    }
    
    public async Task<int> SaveBaseline(OtdrTask task, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var baselineRepository = scope.ServiceProvider.GetRequiredService<IBaselineRepository>();
        var baselineId = await baselineRepository.Add(
            task.MonitoringPortId,
            task.CompletedAt,
            task.CreatedByUserId,
            task.Measurement!.MeasurementSettings!,
            task.Measurement.Progress!.Trace!.SorBytes
            , ct);
        
        var monitoringPortRepository = scope.ServiceProvider.GetRequiredService<IMonitoringPortRepository>();
        await monitoringPortRepository.SetBaseline(task.MonitoringPortId, baselineId, CancellationToken.None);

        return baselineId;
    }
}
