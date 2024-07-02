namespace Fibertest30.Application;

public interface ISystemEventRepository
{
    Task<int> Add(SystemEvent systemEvent, CancellationToken ct);
    
    Task<List<SystemEvent>> GetAll(bool sortDescending, CancellationToken ct);
}