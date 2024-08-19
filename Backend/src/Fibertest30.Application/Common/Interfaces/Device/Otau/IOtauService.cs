namespace Fibertest30.Application;

public interface IOtauService : IAsyncDisposable
{
    void SetMonitoringService(IMonitoringService monitoringService);
    Task<List<CombinedOtau>> GetAllOtau(CancellationToken ct);
    Task<HashSet<int>> GetOnlineOtauPortIds(CancellationToken ct);
    OtauPortPath GetOtauPortPathByMonitoringPortId(int monitoringPortId);
    Task SetPort(int monitoringPortId, CancellationToken ct);
  

  
}