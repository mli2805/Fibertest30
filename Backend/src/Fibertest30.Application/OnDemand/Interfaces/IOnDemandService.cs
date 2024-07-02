namespace Fibertest30.Application;

public interface IOnDemandService
{ 
    string? GetUserOnDemandId(string userId);
    OtdrTask? GetUserOnDemand(string userId);
    Task<OtdrTaskProgressData?> GetUserCurrentOnDemandProgress(string userId);
    Task<OnDemandOtdrTask> StartOnDemand(int monitoringPortId, MeasurementSettings measurementSettings, string userId, CancellationToken ct);
    Task CancelTask(string onDemandId, string userId, CancellationToken ct);
    IObservable<OtdrTaskProgress> ObserveProgress(string onDemandId);
    MeasurementTrace? GetProgressTrace(string onDemandId);
    Task ProcessTask(OtdrTask otdrTask, CancellationToken ct);
}