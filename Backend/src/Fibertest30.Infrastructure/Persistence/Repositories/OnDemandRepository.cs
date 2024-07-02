using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class OnDemandRepository : IOnDemandRepository
{
    private readonly RtuContext _rtuContext;

    public OnDemandRepository(RtuContext rtuContext)
    {
        _rtuContext = rtuContext;
    }
    
    public async Task Add(CompletedOnDemand onDemand, CancellationToken ct)
    {
        _rtuContext.OnDemands.Add(onDemand);
        await _rtuContext.SaveChangesAsync(ct);
    }

    public async Task<CompletedOnDemand> Get(string onDemandId)
    {
        return await _rtuContext.OnDemands.SingleAsync(x => x.Id == onDemandId);
    }
    
    public async Task<byte[]> GetSor(string onDemandId)
    {
        var result = await _rtuContext.OnDemandSors.SingleAsync(x => x.Id == onDemandId);
        return result.Data;
    }

    public async Task<List<CompletedOnDemand>> GetAll(List<int> portIds, bool sortDescending)
    {
        IQueryable<CompletedOnDemand> query = _rtuContext.OnDemands;
        if (portIds.Any())
        {
            query = query.Where(m => portIds.Contains(m.MonitoringPortId));
        }
        
        if (sortDescending)
        {
            query = query.OrderByDescending(x => x.CompletedAt);
        }
        
        return await query.ToListAsync();
    }
}