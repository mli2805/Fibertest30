namespace Fibertest30.Application;

public interface IRtuLinuxPollster
{
    TaskCompletionSource<bool> ServiceStopped { get; }
    void StopService();
    Task PollRtus(CancellationToken ct);

    byte[]? GetMeasurementClientSor(Guid measurementClientId);

}

