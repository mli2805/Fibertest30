namespace Fibertest30.Application;

public interface IMonitoringService
{
    void TryScheduleNext();
    Task StartMonitoring(CancellationToken ct);
    void SetOtauService(IOtauService otauService);
    Task SetMonitoringPortStatus(int monitoringPortId, MonitoringPortStatus status, CancellationToken ct);
    Task SetMonitoringPortSchedule(int monitoringPortId, MonitoringSchedulerMode mode, TimeSpan interval, List<int> timeSlotIds, CancellationToken ct);
    Task SetPortAlarmProfile(int monitoringPortId, int alarmProfileId, CancellationToken ct);
    Task ProcessTask(OtdrTask otdrTask, CancellationToken ct);
}