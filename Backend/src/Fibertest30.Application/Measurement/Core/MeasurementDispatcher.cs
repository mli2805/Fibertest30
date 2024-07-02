using Microsoft.Extensions.Logging;

namespace Fibertest30.Application;

public class MeasurementDispatcher : IMeasurementDispatcher
{
    public TaskCompletionSource<bool> ServiceStopped { get; } = new();
    public int? Tests_ProcessOnlyCount { get; set; }

    private readonly CancellationTokenSource _cts = new();
    private readonly ILogger _logger;
    private readonly IOtdrTasksService _otdrTasksService;
    private readonly IMonitoringService _monitoring;
    private readonly IOnDemandService _onDemand;
    private readonly IBaselineSetupService _baselineSetup;

    public MeasurementDispatcher(
        ILogger<MeasurementDispatcher> logger,
        IOtdrTasksService otdrTasksService,
        IMonitoringService monitoring,
        IOnDemandService onDemand,
        IBaselineSetupService baselineSetup)
    {
        _logger = logger;
        _otdrTasksService = otdrTasksService;
        _monitoring = monitoring;
        _onDemand = onDemand;
        _baselineSetup = baselineSetup;
    }

    public async Task ProcessMeasurements(CancellationToken ct)
    {
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct, _cts.Token);

        while (!ct.IsCancellationRequested)
        {
            try
            {
                await DoProcessMeasurement(cts.Token);
            }
            catch (Exception ex)
            {
                _logger.LogError("ProcessMeasurement failed: {Exception}", ex);
                throw;
            }

            if (Tests_ProcessOnlyCount.HasValue)
            {
                Tests_ProcessOnlyCount--;
                if (Tests_ProcessOnlyCount == 0)
                {
                    break;
                }
            }
        }

        ServiceStopped.SetResult(true);
    }

    private async Task DoProcessMeasurement(CancellationToken ct)
    {
        // before each cycle try to schedule next monitoring task
        _monitoring.TryScheduleNext();

        var nextTaskPriority = await _otdrTasksService.WaitForOtdrTask(ct);

        var otdrTask = _otdrTasksService.ReadOtdrTaskFromChannel(nextTaskPriority);
        if (otdrTask == null || otdrTask.CancellationToken.IsCancellationRequested)
        {
            // cancellation already has removed the task from the tasks queue,
            return;
        }

        if (otdrTask is BaselineSetupOtdrTask)
        {
            await _baselineSetup.ProcessTask(otdrTask, ct);
        }
        else if (otdrTask is OnDemandOtdrTask)
        {
            await _onDemand.ProcessTask(otdrTask, ct);
        }
        else if (otdrTask is MonitoringOtdrTask)
        {
            await _monitoring.ProcessTask(otdrTask, ct);
        }
        else
        {
            throw new Exception($"Unknown task type: {otdrTask.GetType().Name}");
        }
    }

    public void StopService()
    {
        _cts.Cancel();
    }
}