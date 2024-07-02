namespace Fibertest30.Application;

public interface IBaselineSetupService
{
    Task<string> StartBaselineSetup(int monitoringPortId, bool fullAutoMode, MeasurementSettings? measurementSettings,
        string userId, CancellationToken ct);
    Task<List<OtdrTaskProgressData>> GetAllBaselineProgress();
    Task CancelTask(string taskId, string userId, CancellationToken ct);
    IObservable<OtdrTaskProgress> ObserveProgress(string taskId);
    MeasurementTrace? GetProgressTrace(string taskId);
    Task ProcessTask(OtdrTask otdrTask, CancellationToken ct);
}