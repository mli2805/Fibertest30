using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class SystemEventRepository : ISystemEventRepository
{
    private readonly RtuContext _rtuContext;

    public SystemEventRepository(RtuContext rtuContext)
    {
        _rtuContext = rtuContext;
    }
    
    public async Task<int> Add(SystemEvent systemEvent, CancellationToken ct)
    {
        var systemEventEf = systemEvent.ToEf();
        _rtuContext.SystemEvents.Add(systemEventEf);
        await _rtuContext.SaveChangesAsync(ct);
        return systemEventEf.Id;
    }

    public async Task<List<SystemEvent>> GetAll(bool sortDescending, CancellationToken ct)
    {
        IQueryable<SystemEventEf> query = _rtuContext.SystemEvents;
        if (sortDescending)
        {
            query = query.OrderByDescending(x => x.Id);
        }
        
        var systemEvents = await query.ToListAsync(ct);
        return systemEvents.Select(x => x.FromEf()).ToList();
    }
    
   
  
}