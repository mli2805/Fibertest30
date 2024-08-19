namespace Fibertest30.Application;

public interface IOtauRepository
{
    Task<Otaus> ReadOtaus(CancellationToken ct);
    Task<List<Otau>> GetAllOtau(CancellationToken ct); 
    Task<Otau> GetOtau(int otauId, CancellationToken ct);
    

    Task<string> GetPortNameByMonitoringPortId(int monitoringPortId, CancellationToken ct);
}