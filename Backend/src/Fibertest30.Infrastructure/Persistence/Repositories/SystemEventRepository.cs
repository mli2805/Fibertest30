using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class SystemEventRepository : ISystemEventRepository
{
    private readonly ServerDbContext _serverDbContext;

    public SystemEventRepository(ServerDbContext serverDbContext)
    {
        _serverDbContext = serverDbContext;
    }
    
    public async Task<int> Add(SystemEvent systemEvent, CancellationToken ct)
    {
        var systemEventEf = systemEvent.ToEf();
        _serverDbContext.SystemEvents.Add(systemEventEf);
        await _serverDbContext.SaveChangesAsync(ct);
        return systemEventEf.Id;
    }

    public async Task<List<SystemEvent>> GetAll(bool sortDescending, CancellationToken ct)
    {
        IQueryable<SystemEventEf> query = _serverDbContext.SystemEvents;
        if (sortDescending)
        {
            query = query.OrderByDescending(x => x.Id);
        }
        
        var systemEvents = await query.ToListAsync(ct);
        return systemEvents.Select(x => x.FromEf()).ToList();
    }
    
   
  
}