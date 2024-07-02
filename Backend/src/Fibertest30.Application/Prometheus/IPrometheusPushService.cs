namespace Fibertest30.Applications;

public interface IPrometheusPushService
{
    void PushMetrics(int monitoringPortId, byte[] trace, DateTime completedAt, CancellationToken ct);
}