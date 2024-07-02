namespace Fibertest30.Application;

public interface IOtauService : IAsyncDisposable
{
    void SetMonitoringService(IMonitoringService monitoringService);
    Task Initialize(CancellationToken ct);
    void StartPingingOtaus(CancellationToken ct);
    Task<List<CombinedOtau>> GetAllOtau(CancellationToken ct);
    Task<HashSet<int>> GetOnlineOtauPortIds(CancellationToken ct);
    OtauPortPath GetOtauPortPathByMonitoringPortId(int monitoringPortId);
    Task SetPort(int monitoringPortId, CancellationToken ct);
    // int GetMonitoringPortId(OtauPortPath portPath);
    Task<bool> BlinkOsmOtau(int chainAddress, CancellationToken ct);
    Task<bool> BlinkOxcOtau(string ipAddress, int port, CancellationToken ct);
    Task<bool> BlinkOtau(int otauId, CancellationToken ct);
    Task<OtauDiscoverResult> DiscoverOsmOtau(int chainAddress, CancellationToken ct);
    Task<OtauDiscoverResult> DiscoverOxcOtau(string ipAddress, int port, CancellationToken ct);

    Task<Otau> AddOsmOtau(int ocmPortIndex, int chainAddress, CancellationToken ct);
    Task<Otau> AddOxcOtau(int ocmPortIndex, string ipAddress, int port, CancellationToken ct);
    Task<List<ChangedProperty>> UpdateOtau(int otauId, OtauPatch patch, CancellationToken ct);
    Task<CombinedOtau> GetOtau(int otauId, CancellationToken ct);
    Task<Otau> RemoveOtau(int otauId, CancellationToken ct);
}