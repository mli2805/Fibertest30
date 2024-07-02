namespace Fibertest30.Application;

public interface IMeasurementDispatcher
{
    TaskCompletionSource<bool> ServiceStopped { get; }
    void StopService();
    Task ProcessMeasurements(CancellationToken ct);
}