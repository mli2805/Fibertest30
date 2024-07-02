using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;

namespace Fibertest30.Application;

public class OnDemandService : OtdrTaskService<IOnDemandService>, IOnDemandService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public OnDemandService(
        ILogger<IOnDemandService> logger,
        IDateTime dateTime, 
        IMeasurementService measurement,
        IServiceScopeFactory serviceScopeFactory,
        IOtdrTasksService otdrTasksService,
        ISystemEventSender systemEventSender)
    : base(logger, dateTime, otdrTasksService, measurement, systemEventSender)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public string? GetUserOnDemandId(string userId)
    {
        return GetUserOnDemand(userId)?.Id;
    }
    
    public OtdrTask? GetUserOnDemand(string userId)
    {
        return _otdrTasksService.GetTasksCopy()
            .OfType<OnDemandOtdrTask>().FirstOrDefault(x => x.CreatedByUserId == userId);
    }

    public async Task<OtdrTaskProgressData?> GetUserCurrentOnDemandProgress(string userId)
    {
        var task = GetUserOnDemand(userId);
        if (task == null) { return null; }

        var progress = await ObserveProgress(task.Id).Take(1).ToTask();
        
       return new OtdrTaskProgressData(
            task.Id, task.ToTaskType(), task.MonitoringPortId, task.CreatedByUserId,
            progress.QueuePosition, progress.Status, progress.Progress,
            progress.CompletedAt,
            progress.StepName);
        
    }
    
    protected override async Task OnCompleted(OtdrTask task, CancellationToken ct)
    {
        await SaveOnDemand(task, ct);
    }

    protected override async Task OnAfterCompleted(OtdrTask task, CancellationToken ct)
    {
        await _systemEventSender.Send(
            SystemEventFactory.OnDemandCompleted(task.CreatedByUserId, task.Id, task.Measurement.MonitoringPortId));
    }

    protected override async Task OnFailed(OtdrTask task, string failReason, CancellationToken ct)
    {
        await _systemEventSender.Send(
            SystemEventFactory.OnDemandFailed(task.CreatedByUserId, 
                task.Id, task.Measurement.MonitoringPortId, failReason));
    }

    protected override Task OnCancelled(OtdrTask task, string userId, CancellationToken ct)
    {
        return Task.CompletedTask;
    }

    protected override async Task Measure(OtdrTask task, CancellationToken ct)
    {
        await _measurement.Measure(task.Measurement, ct);
    }

    public Task<OnDemandOtdrTask> StartOnDemand(int monitoringPortId, 
        MeasurementSettings measurementSettings, 
        string userId, CancellationToken ct)
    {
        // only one OnDemand per user
        if (_otdrTasksService.GetTasksCopy().OfType<OnDemandOtdrTask>()
            .Any(x => x.CreatedByUserId == userId))
        {
            throw new OnDemandAlreadyStartedException($"User {userId} already has an active OnDemand");
        }

        var onDemandOtdrTask = new OnDemandOtdrTask(
            Guid.NewGuid().ToString(), 
            OtdrTaskPriority.UserTask, 
            monitoringPortId,
            _dateTime.UtcNow, userId);
        onDemandOtdrTask.Measurement.SetMeasurementSettings(measurementSettings);
        
        StartTask(onDemandOtdrTask);
        return Task.FromResult(onDemandOtdrTask);
    }

    private async Task SaveOnDemand(OtdrTask onDemand, CancellationToken ct)
    {
        var completedOnDemand = new CompletedOnDemand
        {
            Id = onDemand.Id,
            CreatedAt = onDemand.CreatedAt,
            StartedAt = onDemand.StartedAt,
            CompletedAt = onDemand.CompletedAt,
            CreatedByUserId = onDemand.CreatedByUserId,
            MonitoringPortId = onDemand.Measurement.MonitoringPortId,
            MeasurementSettings = onDemand.Measurement!.MeasurementSettings!,
            Sor = new CompletedOnDemandSor
            {
                Id = onDemand.Id,
                Data = onDemand.Measurement.Progress!.Trace!.SorBytes
            }
        };

        // we can't use scoped IOnDemandRepository directly in singleton IOnDemandService
        using var scope = _serviceScopeFactory.CreateScope();
        var onDemandRepository = scope.ServiceProvider.GetRequiredService<IOnDemandRepository>();
        await onDemandRepository.Add(completedOnDemand, ct);
    }
}