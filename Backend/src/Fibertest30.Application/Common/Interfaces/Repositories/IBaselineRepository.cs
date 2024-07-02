namespace Fibertest30.Application;

public interface IBaselineRepository
{
    Task<int> Add(int monitoringPortId, DateTime createdAt, 
        string createdByUserId,
        MeasurementSettings measurementSettings, byte[] data, CancellationToken ct);
    Task<MonitoringBaseline> Get(int baselineId, CancellationToken ct);
    Task<byte[]> GetSor(int baselineId, CancellationToken ct);
    Task<List<MonitoringBaseline>> GetByMonitoringPort(int monitoringPortId, bool sortDescending);
    Task<List<MonitoringBaseline>> GetFilteredPortion(List<int> portIds, bool sortDescending, CancellationToken ct);

}