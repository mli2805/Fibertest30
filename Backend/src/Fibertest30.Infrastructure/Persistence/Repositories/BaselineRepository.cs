using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class BaselineRepository : IBaselineRepository
{
    private readonly RtuContext _rtuContext;
    private readonly int _pageSize = 250;

    public BaselineRepository(RtuContext rtuContext)
    {
        _rtuContext = rtuContext;
    }

    public async Task<int> Add(int monitoringPortId, DateTime createdAt, 
        string createdByUserId, 
        MeasurementSettings measurementSettings,
        byte[] data,
        CancellationToken ct)
    {
        var baseline = new MonitoringBaselineEf
        {
            MonitoringPortId = monitoringPortId,
            CreatedAt = createdAt,
            CreatedByUserId = createdByUserId,
            MeasurementSettings = measurementSettings,
            Sor = new MonitoringBaselineSorEf()
            {
                Data = data
            }
        };
        
        
        _rtuContext.Baselines.Add(baseline);
        await _rtuContext.SaveChangesAsync(ct);
        return baseline.Id;
    }

    public async Task<MonitoringBaseline> Get(int baselineId, CancellationToken ct)
    {
        var baseline = await _rtuContext.Baselines.SingleAsync(x => x.Id == baselineId, ct);
        return baseline.FromEf();
    }

    public async Task<byte[]> GetSor(int baselineId, CancellationToken ct)
    {
        var result = await _rtuContext.BaselineSors.SingleAsync(x => x.Id == baselineId, ct);
        return result.Data;
    }
    
    // public async Task<byte[]> GetSorByMonitoringPortId(int monitoringPortId)
    // {
    //     var baselineId = await _rtuContext.Baselines
    //         .Where(x => x.MonitoringPortId == monitoringPortId)
    //         .Select(x => x.Id)
    //         .SingleAsync();
    //
    //     var result = await _rtuContext.BaselineSors.SingleAsync(x => x.Id == baselineId);
    //     return result.Data;
    // }

    public async Task<List<MonitoringBaseline>> GetByMonitoringPort(int monitoringPortId, bool sortDescending)
    {
        IQueryable<MonitoringBaselineEf> query =
            _rtuContext.Baselines.Where(x => x.MonitoringPortId == monitoringPortId);
        
        if (sortDescending)
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }
        
        return await query
            .Select(x => x.FromEf())
            .ToListAsync();
    }

    public async Task<List<MonitoringBaseline>> GetFilteredPortion(List<int> portIds, bool sortDescending, CancellationToken ct)
    {
        IQueryable<MonitoringBaselineEf> query = _rtuContext.Baselines;

        if (portIds.Any())
            query = query.Where(m => portIds.Contains(m.MonitoringPortId));

        if (sortDescending)
            query = query.OrderByDescending(x => x.CreatedAt);

        return await query.Take(_pageSize).Select(b=>b.FromEf()).ToListAsync(ct);
    }
}