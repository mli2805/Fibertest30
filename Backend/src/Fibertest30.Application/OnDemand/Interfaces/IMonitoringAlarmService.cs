namespace Fibertest30.Application;

public interface IMonitoringAlarmService
{
    Task ProcessMonitoringChanges(int monitoringPortId, int monitoringId
        , int baselineId, List<MonitoringChange> changes, CancellationToken ct);
}