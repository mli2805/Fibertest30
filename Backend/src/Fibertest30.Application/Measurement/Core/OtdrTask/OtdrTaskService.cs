using Microsoft.Extensions.Logging;
using System.Reactive;
using System.Reactive.Linq;

namespace Fibertest30.Application;

public abstract class OtdrTaskService<T>
{
    private volatile OtdrTask? _currentTask;
    protected readonly IMeasurementService _measurement;
    protected readonly ISystemEventSender _systemEventSender;
    protected readonly ILogger<T> _logger;
    protected readonly IDateTime _dateTime;
    protected readonly IOtdrTasksService _otdrTasksService;

    protected OtdrTaskService(
        ILogger<T> logger,
        IDateTime dateTime, 
        IOtdrTasksService otdrTasksService,
        IMeasurementService measurement,
        ISystemEventSender systemEventSender)
    {
        _logger = logger;
        _dateTime = dateTime;
        _otdrTasksService = otdrTasksService;
        _measurement = measurement;
        _systemEventSender = systemEventSender;
    }

    protected abstract Task OnCompleted(OtdrTask task, CancellationToken ct);
    protected abstract Task OnAfterCompleted(OtdrTask task, CancellationToken ct);
    protected abstract Task OnFailed(OtdrTask task, string failReason, CancellationToken ct);
    protected abstract Task OnCancelled(OtdrTask task, string userId, CancellationToken ct);
    protected abstract Task Measure(OtdrTask task, CancellationToken ct);
    
    public MeasurementTrace? GetProgressTrace(string taskId)
    {
        var currentTaskCopy = _currentTask;
        if (currentTaskCopy?.Id == taskId)
        {
            return _measurement.GetLastProgressSorData(currentTaskCopy.Measurement);
        }

        return null;
    }
    
    protected void StartTask(OtdrTask task)
    {
        if (!_otdrTasksService.TryAdd(task))
        {
            throw new Exception($"Failed to add {GetType().Name} task with id: " + task.Id);
        }
        
        task.ObserveProgress = ObserveProgress(task).Subscribe(x =>
        {
            // _logger.LogInformation(
            //                 $"OtdrTask Progress " +
            //                 $", id: {task.Id}" +
            //                 $", type: {task.ToTaskType()}" +
            //                 $", status: {task.Status}" +
            //                 $", progress: {x.Progress}" +
            //                 $", stepName: {x.StepName}" +
            //                 $", queuePosition: {x.QueuePosition}" +
            //                 $", failReason: {task.FailReason}");
                            
            _systemEventSender.Send(SystemEventFactory.OtdrTaskProgress
                (task.CreatedByUserId, task.Id, task.ToTaskType(), task.MonitoringPortId, x, task.FailReason));
        });

        if (!_otdrTasksService.WriteOtdrTaskToChannel(task))
        {
            // should never happen
        }
    }
    
    public async Task CancelTask(string taskId, string userId, CancellationToken ct)
    {
        // remove from the queue
        TryRemoveTask(taskId, out var task);
        if (task == null)
        {
            return;
        }
        
        task.Cancel();
        task.SetStatus(OtdrTaskStatus.Cancelled);
        
        
        var currentTaskCopy = _currentTask;
        if (currentTaskCopy != null && currentTaskCopy == task)
        {
            await _measurement.StopOtdrMeasurement(currentTaskCopy.Measurement);
        }
        else
        {
            // to finish observeProgress
            task.Measurement.NotifyComplete();
        }

        await OnCancelled(task, userId, ct);
    }
    
    public async Task ProcessTask(OtdrTask task, CancellationToken processTaskCancellationToken)
    {
        var ct = CancellationTokenSource.CreateLinkedTokenSource(processTaskCancellationToken, task.CancellationToken).Token;
        task.StartedAt = _dateTime.UtcNow;

        try
        {
            await DoProcessTask(task, ct);
        }
        finally
        {
            if (task.Status != OtdrTaskStatus.Cancelled)
            {
                // cancelled task already removed from the queue
                // let's not removed it again, because a new task with the same id can be added in meantime
                TryRemoveTask(task.Id, out _);
            }
        }
    }
    
    private async Task DoProcessTask(OtdrTask task, CancellationToken ct)
    {
        await MeasureTask(task, ct);

        // if not in queue, it means that the task was cancelled or failed
        if(ct.IsCancellationRequested 
           || task.Status == OtdrTaskStatus.Cancelled
           || task.Status == OtdrTaskStatus.Failed)  
        {
            return;
        }
        
        task.CompletedAt = _dateTime.UtcNow;
        
        // process further in OnCompleted, like save it to the database, etc.
        try
        {
            await OnCompleted(task, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $" Failed to complete task: {GetType().Name} taskId: {task.Id}" );
            await FailTaskFromException(task, ex, ct);
            return;
        }
        
        task.SetStatus(OtdrTaskStatus.Completed);
        await OnAfterCompleted(task, ct);
    }
    
    private async Task MeasureTask(OtdrTask task, CancellationToken ct)
    {
        _currentTask = task;
        task.SetStatus(OtdrTaskStatus.Running);
        try
        {
            await Measure(task, ct);
        }
        catch (OperationCanceledException)
        {
            // do nothing, we already remove the task from the queue and set proper status
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $" Failed to measure service: {GetType().Name} taskId: {task.Id}" );
            await FailTaskFromException(task, ex, ct);
        }
        finally
        {
            _currentTask = null;
        }
    }

    private async Task FailTaskFromException(OtdrTask task, Exception ex, CancellationToken ct)
    {
        var failReason = (ex as OtauSetPortException)?.Reason.ToString() ?? "Unknown";
        task.SetStatus(OtdrTaskStatus.Failed, failReason);
        await OnFailed(task, failReason, ct);
    }
    
    public IObservable<OtdrTaskProgress> ObserveProgress(string taskId)
    {
        if (!_otdrTasksService.TryGetValue(taskId, out var task))
        {
            throw new ArgumentException("Can't get task for TaskProgress");
        }
        
        return ObserveProgress(task);
    }
    
    public IObservable<OtdrTaskProgress> ObserveProgress(OtdrTask task)
    {
        var measurementProgress = task.Measurement.ProgressObservable
            .StartWith(task.Measurement.Progress);
        
       
        var taskStatus = task.StatusObservable
            .StartWith(task.Status);
        
       
        var observeQueuePositionTillMeasurementEnds = _otdrTasksService.QueuePositionChanged
            .StartWith(Unit.Default)
            .Select(_ => {            
                var queuePosition = _otdrTasksService.GetTasksCopy()
                    .OrderBy(x => x.Priority)
                    .ThenBy(x => x.CreatedAt)
                    .ToList()
                    .FindIndex(x => x.Id == task.Id);
                return queuePosition;
            })
            // do not fire when queuePosition is -1.
            // OnDemand was cancelled or not yet added to the tasks.
            .Where(x => x != -1) 
            .TakeUntil(taskStatus.IgnoreElements().LastOrDefaultAsync());

        var taskProgress = Observable.CombineLatest(
                measurementProgress, taskStatus, observeQueuePositionTillMeasurementEnds,
                (progress, status, queuePosition) => 
                    new OtdrTaskProgress(queuePosition, 
                        status.ToString(), 
                        progress?.Progress ?? 0, 
                        task.CompletedAt,
                        progress?.StepName ?? string.Empty))
            .Where(x =>
            {
                // skip the needless status right before the measurement starts
                // the next one will be QueuePosition = 0, Status = Running
                // (to avoid fast status blinking)
                // BUT not if other (Monitoring) Measurement is in progress
                    
                var currentMeasurementCopy = _measurement.CurrentMeasurement;
                var anotherMeasurementInProgress = currentMeasurementCopy != null 
                                                   && currentMeasurementCopy != task.Measurement;

                var skipPendingProgress = x.QueuePosition == 0 && x.Status == OtdrTaskStatus.Pending.ToString();
                var skipProgress = skipPendingProgress && !anotherMeasurementInProgress;
                    
                return !skipProgress;
            })
            .DistinctUntilChanged(); // works fine as OnDemandProgress is a record
        
        // onDemandProgress.Subscribe(
        //     x => Debug.WriteLine("onDemandProgress " +  x),
        //     () => Debug.WriteLine("onDemandProgress completed")
        // );

        return taskProgress;
    }
    
    private void TryRemoveTask(string taskId, out OtdrTask? task)
    {
        _otdrTasksService.TryRemoveTask(taskId, out task);
    }
}