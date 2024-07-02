namespace Fibertest30.Application;

public interface IMonitoringPortRepository
{
    Task<List<MonitoringPort>> GetAllMonitoringPorts(CancellationToken ct);
    Task<MonitoringPort> GetMonitoringPort(int monitoringPortId, CancellationToken ct);
    Task<List<MonitoringPort>> GetOtauMonitoringPorts(int otauId, CancellationToken ct);
    Task<MonitoringPort?> SetMonitoringPortStatus(int monitoringPortId, MonitoringPortStatus status, CancellationToken ct);
    Task<List<MonitoringTimeSlot>> GetMonitoringTimeSlots(CancellationToken ct);
    Task SetLastRun(int monitoringPortId, DateTime lastRun, CancellationToken ct);
    Task SetBaseline(int monitoringPortId, int baselineId, CancellationToken ct);
    Task SetMonitoringPortSchedule(int monitoringPortId, 
        MonitoringSchedulerMode mode, TimeSpan interval, List<int> timeSlotIds, CancellationToken ct);
   Task SetMonitoringPortAlarmProfile(int monitoringPortId, 
        int alarmProfileId, CancellationToken ct);
   Task SetMonitoringPortNote(int monitoringPortId, string note, CancellationToken ct);

}