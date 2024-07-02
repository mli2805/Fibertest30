using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class AlarmEventRepository : IAlarmEventRepository
{
    private readonly RtuContext _rtuContext;
    private readonly int _pageSize = 250;

    public AlarmEventRepository(RtuContext rtuContext)
    {
        _rtuContext = rtuContext;
    }

    public async Task<List<MonitoringAlarmEvent>> GetFilteredPortion(List<int> portIds, bool sortDescending)
    {
        IQueryable<MonitoringAlarmEventEf> query = _rtuContext.AlarmEvents;

        if (portIds.Any())
        {
            query = query.Where(m => portIds.Contains(m.MonitoringPortId));
        }

        if (sortDescending)
        {
            query = query.OrderByDescending(x => x.Id);
        }

        return await query.Take(_pageSize).Select(x => x.FromEf()).ToListAsync();
    }
}
