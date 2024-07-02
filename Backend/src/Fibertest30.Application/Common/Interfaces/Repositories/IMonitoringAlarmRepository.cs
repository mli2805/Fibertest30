namespace Fibertest30.Application;

public interface IMonitoringAlarmRepository
{
    /// <summary>
    /// Retrieves a monitoring alarm with its associated events.
    /// </summary>
    /// <param name="alarmId">The ID of the alarm to retrieve.</param>
    /// <param name="alarmGroupId">Optional group ID to filter the alarm events. If null, all events for the alarm are returned.</param>
    /// <param name="ct"></param>
    /// <returns></returns>
    Task<MonitoringAlarm> GetAlarmWithEvents(int alarmId, int? alarmGroupId, CancellationToken ct);
    Task<List<MonitoringAlarm>> GetAllActiveAlarms(bool includeEvents, CancellationToken ct);
    Task<List<MonitoringAlarm>> GetAllAlarms(List<int> portIds, bool includeEvents, CancellationToken ct);

    Task<List<MonitoringAlarm>> GetMonitoringPortAlarms(int monitoringPortId, CancellationToken ct);
    Task<List<MonitoringAlarm>> GetMonitoringPortActiveAlarms(int monitoringPortId, CancellationToken ct);
    Task<List<MonitoringAlarmEvent>> SaveAlarmProcessing(int monitoringPortId, int monitoringId, int baselineId,
        AlarmProcessingContext ctx, CancellationToken ct);
}