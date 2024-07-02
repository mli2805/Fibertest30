namespace Fibertest30.Application;

public interface IMonitoringRepository
{
    Task<int> Add(MonitoringResult monitoring);
    
    Task<MonitoringResult> Get(int monitoringId, bool addExtra);

    Task<byte[]> GetSor(int monitoringId);
    
    Task<List<MonitoringResult>> GetFilteredPortion(List<int> portIds, DateTimeFilter dateTimeFilter, CancellationToken ct);
    
    Task<MonitoringResult?> GetLastMonitoringResult(int monitoringPortId, int baselineId, CancellationToken ct);
    Task<byte[]?> GetLastMonitoringResultSor(int monitoringPortId, int baselineId, CancellationToken ct);
}