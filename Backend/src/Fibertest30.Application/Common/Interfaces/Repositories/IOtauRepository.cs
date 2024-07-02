namespace Fibertest30.Application;

public interface IOtauRepository
{
    Task<Otaus> ReadOtaus(CancellationToken ct);
    Task<List<Otau>> GetAllOtau(CancellationToken ct); 
    Task<Otau> GetOtau(int otauId, CancellationToken ct);
    
    Task<int> AddOtau(OtauType type, int ocmPortIndex,
        string serialNumber, int portCount, IOtauParameters otauParameters);

    Task ChangeOtau(Otau currentOtau, string discoverSerialNumber, int discoverPortCount, CancellationToken ct);

    Task<List<ChangedProperty>> UpdateOtau(int otauId, OtauPatch patch, CancellationToken ct);

    Task UpdateOtauOnlineAtOfflineAt(int otauId, DateTime? onlineAt, DateTime? offlineAt,
        CancellationToken ct);
    
    Task RemoveOtau(int otauId, CancellationToken ct);

    Task<string> GetPortNameByMonitoringPortId(int monitoringPortId, CancellationToken ct);
}