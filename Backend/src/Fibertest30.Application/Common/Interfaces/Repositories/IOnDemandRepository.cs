namespace Fibertest30.Application;

public interface IOnDemandRepository
{
    Task Add(CompletedOnDemand onDemand, CancellationToken ct);
    
    Task<CompletedOnDemand> Get(string onDemandId);

    Task<byte[]> GetSor(string onDemandId);
    
    Task<List<CompletedOnDemand>> GetAll(List<int> portIds, bool sortDescending);
}