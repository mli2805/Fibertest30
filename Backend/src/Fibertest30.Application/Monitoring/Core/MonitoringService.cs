using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Fibertest30.Applications;
using System.Reactive.Linq;

namespace Fibertest30.Application;

public class MonitoringService : OtdrTaskService<IMonitoringService>, IMonitoringService, IDisposable
{
    public static string MonitoringTaskId { get; } = "monitoring";

    private bool _startMonitoring;

    private IOtauService _otauService = null!;
    private readonly IMonitoringScheduler _scheduler;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ITraceComparator _traceComparator;
    private readonly IMonitoringAlarmService _alarmService;
    private readonly IPrometheusPushService _prometheusPushService;

    private readonly object _tryScheduleNextLock = new();
    private readonly IEnumerator<ScheduledNext> _schedulerEnumerator;
    private Timer? _scheduleNextTimer;

    private readonly IDisposable _stream;

    public MonitoringService(
        ILogger<IMonitoringService> logger,
        IDateTime dateTime,
        IOtdrTasksService otdrTasksService,
        IMeasurementService measurement,
        ISystemEventDispatcher systemEventDispatcher,
        IMonitoringScheduler scheduler,
        IServiceScopeFactory serviceScopeFactory,
        ITraceComparator traceComparator,
        IMonitoringAlarmService alarmService,
        IPrometheusPushService prometheusPushService,
        ISystemEventSender systemEventSender)
        : base(logger, dateTime, otdrTasksService, measurement, systemEventSender)
    {
        _scheduler = scheduler;
        _serviceScopeFactory = serviceScopeFactory;
        _traceComparator = traceComparator;
        _alarmService = alarmService;
        _prometheusPushService = prometheusPushService;
        _schedulerEnumerator = scheduler.GetEnumerator();

        _stream = systemEventDispatcher.GetEventStream()
            .Where(x => x.Type == SystemEventType.OtauRemoved
                        || x.Type == SystemEventType.OtauAdded
                        || x.Type == SystemEventType.OtauChanged
                        || x.Type == SystemEventType.OtauConnectionStatusChanged
                        || x.Type == SystemEventType.MonitoringPortScheduleChanged
                        || x.Type == SystemEventType.MonitoringPortStatusChanged)
            .Throttle(TimeSpan.FromMilliseconds(200))
            .Select(_ => Observable.FromAsync(() => ReSchedule(CancellationToken.None)))
            .Concat()
            .Subscribe();
    }

    protected override async Task OnCompleted(OtdrTask task, CancellationToken ct)
    {
        var monitoringTask = (MonitoringOtdrTask)task;
        
        await SetLastRun(task.MonitoringPortId, task.StartedAt, ct);
        
        
        MonitoringBaseline baseline = monitoringTask.Baseline!;
        var baselineSor = await GetBaselineSor(baseline.Id ,ct); 
        
        var alarmProfileId = monitoringTask.AlarmProfileId;
        var alarmProfile = await GetAlarmProfile(alarmProfileId, ct);
        
        var result = await _traceComparator.Compare(
            task.MonitoringPortId, 
            baselineSor,
            measurementSor: task.Measurement.Progress!.Trace!.SorBytes, 
            alarmProfile);

        FillAdditionalChangesContextFromBaseline(result.Changes, baselineSor);

        var monitoringId = await SaveMonitoring((MonitoringOtdrTask)task, result.ModifiedTrace, result.Changes, ct);
        await _alarmService.ProcessMonitoringChanges(task.MonitoringPortId, monitoringId, baseline.Id, result.Changes, ct);

        _prometheusPushService.PushMetrics(task.MonitoringPortId, result.ModifiedTrace, task.CompletedAt, ct);
    }

    protected override Task OnAfterCompleted(OtdrTask task, CancellationToken ct)
    {
        return Task.CompletedTask;
    }

    protected override async Task OnFailed(OtdrTask task, string failReason, CancellationToken ct)
    {
        // set last run, so we won't start failed monitoring again
        await SetLastRun(task.MonitoringPortId, task.StartedAt, ct);
    }

    protected override Task OnCancelled(OtdrTask task, string userId, CancellationToken ct)
    {
        return Task.CompletedTask;
    }

    protected override async Task Measure(OtdrTask task, CancellationToken ct)
    {
        var monitoringPort = await GetMonitoringPort(task.MonitoringPortId, ct);
        if (monitoringPort.Baseline == null)
        {
            throw new Exception($"Monitoring port {monitoringPort.Id} has no baseline assigned");
        }

        ((MonitoringOtdrTask)task).AlarmProfileId = monitoringPort.AlarmProfileId;
        ((MonitoringOtdrTask)task).Baseline = monitoringPort.Baseline;

        var baselineSor = await GetBaselineSor(monitoringPort.Baseline.Id ,ct);

        // baselineSor is used for a device, other MeasurementSettings for emulator
        var measurementSettings = monitoringPort.Baseline.MeasurementSettings; 
        measurementSettings.Baseline = baselineSor;
        
        task.Measurement.SetMeasurementSettings(measurementSettings);
        await _measurement.Measure(task.Measurement, ct);
    }

    public void TryScheduleNext()
    {
        if (!_startMonitoring)
        {
            return;
        }

        lock (_tryScheduleNextLock)
        {
            if (_otdrTasksService.TryGetValue(MonitoringTaskId, out var _))
            {
                return;
            }

            _scheduleNextTimer?.Dispose();
            _scheduleNextTimer = null;

            var next = GetScheduledNext();
            if (next.Port != null)
            {
                var monitoring = CreateMonitoring(next.Port.MonitoringPortId);
                StartTask(monitoring);
            }
            else if (next.Delay != null && !next.IsNothingToRun())
            {
                var delayTime = next.Delay.NextScheduleAt - DateTime.UtcNow;
                _scheduleNextTimer = new Timer(_ =>
                {
                    TryScheduleNext();
                }, null, delayTime, Timeout.InfiniteTimeSpan);
            }
        }
    }

    private MonitoringOtdrTask CreateMonitoring(int monitoringPortId)
    {
        return new MonitoringOtdrTask(MonitoringTaskId, OtdrTaskPriority.Monitoring,
            monitoringPortId,
            _dateTime.UtcNow, string.Empty);
    }

    private ScheduledNext GetScheduledNext()
    {
        _schedulerEnumerator.MoveNext();
        var current = _schedulerEnumerator.Current;
        return current;
    }

    public void SetOtauService(IOtauService otauService)
    {
        _otauService = otauService;
    }

    public async Task StartMonitoring(CancellationToken ct)
    {
        _startMonitoring = true;
        await ReSchedule(ct);
    }

    private async Task ReSchedule(CancellationToken ct)
    {
        // NOTE: ReSchedule does not need additional synchronization because 
        // it is only called as a reaction to SystemEvent (instead first initialization, when monitoring starts)
        // and we ConcatMap observables in stream, so it is guaranteed that only one ReSchedule is running at a time

        var scheduledPorts = await UpdateScheduledPorts(ct);

        if (_otdrTasksService.TryGetValue(MonitoringTaskId, out var currentMonitoring))
        {
            if (scheduledPorts.All(x => x.MonitoringPortId != currentMonitoring.MonitoringPortId))
            {
                // current monitoring not enabled at this moment
                await CancelTask(MonitoringTaskId, string.Empty, ct);
            }
        }

        TryScheduleNext();
    }

    private async Task<List<ScheduledPort>> UpdateScheduledPorts(CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringPortRepository = scope.ServiceProvider.GetRequiredService<IMonitoringPortRepository>();

        var onlineOtauPortIds = await _otauService.GetOnlineOtauPortIds(ct);
        var onlineMonitoringPorts = await monitoringPortRepository.GetAllMonitoringPorts(ct);
        var scheduledPorts = onlineMonitoringPorts
            .Where(x => x.Status == MonitoringPortStatus.On && onlineOtauPortIds.Contains(x.OtauPortId))
            .ToScheduledPorts();

        _scheduler.SetPorts(scheduledPorts);

        return scheduledPorts;
    }

    private async Task SetLastRun(int monitoringPortId, DateTime lastRun, CancellationToken ct)
    {
        _scheduler.UpdateLastRun(monitoringPortId, lastRun);

        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringPortRepository = scope.ServiceProvider.GetRequiredService<IMonitoringPortRepository>();

        await monitoringPortRepository.SetLastRun(monitoringPortId, lastRun, ct);
    }

    private async Task<MonitoringPort> GetMonitoringPort(int monitoringPortId, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringPortRepository = scope.ServiceProvider.GetRequiredService<IMonitoringPortRepository>();
        return await monitoringPortRepository.GetMonitoringPort(monitoringPortId, ct);
    }
    
    private async Task<byte[]> GetBaselineSor(int baselineId, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var repo = scope.ServiceProvider.GetRequiredService<IBaselineRepository>();
        return await repo.GetSor(baselineId, ct);
    }
    
    private async Task<AlarmProfile> GetAlarmProfile(int alarmProfileId, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var repo = scope.ServiceProvider.GetRequiredService<IAlarmProfileRepository>();
        return await repo.GetById(alarmProfileId, ct);
    }

    private async Task<int> SaveMonitoring(MonitoringOtdrTask monitoring
        , byte[] modifiedSor
        , List<MonitoringChange> changes,  CancellationToken ct)
    {
        var monitoringResult = new MonitoringResult
        {
            CompletedAt = monitoring.CompletedAt.ToUnixTime(),
            MonitoringPortId = monitoring.Measurement!.MonitoringPortId,
            BaselineId = monitoring.Baseline!.Id,
            MostSevereChangeLevel =   changes.GetMostSevereChangeLevel(),
            ChangesCount = changes.Count,
            Sor = new MonitoringResultSor()
            {
                Data = modifiedSor,
                MeasurementSettings = monitoring.Measurement!.MeasurementSettings!,
                Changes = changes,
            }
        };

        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringRepository = scope.ServiceProvider.GetRequiredService<IMonitoringRepository>();
        return await monitoringRepository.Add(monitoringResult);
    }

    public async Task SetMonitoringPortStatus(int monitoringPortId, MonitoringPortStatus status, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringPortRepository = scope.ServiceProvider.GetRequiredService<IMonitoringPortRepository>();

        await monitoringPortRepository.SetMonitoringPortStatus(monitoringPortId, status, ct);
    }

    public async Task SetMonitoringPortSchedule(int monitoringPortId,
        MonitoringSchedulerMode mode, TimeSpan interval, List<int> timeSlotIds, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringPortRepository = scope.ServiceProvider.GetRequiredService<IMonitoringPortRepository>();

        await monitoringPortRepository.SetMonitoringPortSchedule(monitoringPortId, mode, interval, timeSlotIds, ct);
    }

    public async Task SetPortAlarmProfile(int monitoringPortId, int alarmProfileId, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringPortRepository = scope.ServiceProvider.GetRequiredService<IMonitoringPortRepository>();

        await monitoringPortRepository.SetMonitoringPortAlarmProfile(monitoringPortId, alarmProfileId, ct);
    }
    
    private void FillAdditionalChangesContextFromBaseline(List<MonitoringChange> changes, byte[] baselineSor)
    {
        if (changes.Count == 0)
        {
            return;
        }
        
        var trace = new MeasurementTrace(baselineSor);
        
        // Changes do not have all the data we need at this point,
        
        // TraceComparer either sets Baseline or BaselineLeft, so we nee to fill:
        // - BaselineLeft & BaselineRight is Baseline is set
        // - BaselineRight only is BaselineLeft is set

        foreach (var change in changes)   
        {
            // We expect some code above fulfilled Baseline or BaselineLeft
            // But there is no distance in the Change for a baseline, so we need to fill DistanceMeters here
            // Is you ask, can we just use baseline or baselineLeft right from baselineSor
            // and completely ignore the data in the Change?
            // I think we could, it seems like there is no big difference
            // We just need to get baseline's or baselineLeft's keyEventIndex for that
            
            // Note: Emulator already fullfulled DistanceMeters
            
            if (change.Baseline != null)
            {
                var baseline = trace.SorData.GetMonitoringChangeKeyEvent(change.Baseline.KeyEventIndex);
                change.Baseline.DistanceMeters = baseline?.DistanceMeters; // fill the DistanceMeters
                
                change.BaselineLeft = trace.SorData.GetMonitoringChangeKeyEvent(change.Baseline.KeyEventIndex - 1);
                change.BaselineRight = trace.SorData.GetMonitoringChangeKeyEvent(change.Baseline.KeyEventIndex + 1);
            } else if (change.BaselineLeft != null)
            {
                var baselineLeft = trace.SorData.GetMonitoringChangeKeyEvent(change.BaselineLeft.KeyEventIndex);
                change.BaselineLeft.DistanceMeters = baselineLeft?.DistanceMeters; // fill the DistanceMeters
                
                change.BaselineRight = trace.SorData.GetMonitoringChangeKeyEvent(change.BaselineLeft.KeyEventIndex + 1);
            }
        }
    }

    public void Dispose()
    {
        _schedulerEnumerator.Dispose();
        _stream.Dispose();
    }
}