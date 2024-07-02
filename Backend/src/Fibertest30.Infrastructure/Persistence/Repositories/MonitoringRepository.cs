using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class MonitoringRepository : IMonitoringRepository
{
    private readonly RtuContext _rtuContext;
    private readonly IDateTime _dateTime;
    private readonly int _pageSize = 250;

    public MonitoringRepository(RtuContext rtuContext, IDateTime _dateTime)
    {
        _rtuContext = rtuContext;
        this._dateTime = _dateTime;
    }

    public async Task<int> Add(MonitoringResult monitoring)
    {
        _rtuContext.Monitorings.Add(monitoring);
        await _rtuContext.SaveChangesAsync();
        return monitoring.Id;
    }

    public async Task<MonitoringResult> Get(int monitoringId, bool addExtra)
    {
        var monitoring = await _rtuContext.Monitorings.SingleAsync(x => x.Id == monitoringId);
        if (addExtra)
        {
            var extraInfo = await _rtuContext.MonitoringSors
                .Where(x => x.Id == monitoringId)
                .Select(x => new { x.MeasurementSettings, x.Changes })
                .SingleAsync();

            monitoring.MeasurementSettings = extraInfo.MeasurementSettings;
            monitoring.Changes = extraInfo.Changes;
        }


        return monitoring;
    }

    public async Task<byte[]> GetSor(int monitoringId)
    {
        var data = await _rtuContext.MonitoringSors
            .Where(x => x.Id == monitoringId)
            .Select(x => x.Data).SingleAsync();
        return data;
    }

    public async Task<List<MonitoringResult>> GetFilteredPortion
        (List<int> portIds, DateTimeFilter dateTimeFilter, CancellationToken ct)
    {
        IQueryable<MonitoringResult> query = _rtuContext.Monitorings.AsNoTracking();

        if (portIds.Any())
        {
            query = query.Where(m => portIds.Contains(m.MonitoringPortId));
        }

        query = query.ApplyDateTimeFilter(_dateTime, dateTimeFilter, x => x.CompletedAt, x => x.ToUnixTime());
        return await query.Take(_pageSize).ToListAsync(ct);
    }
    
    public async Task<MonitoringResult?> GetLastMonitoringResult(int monitoringPortId, int baselineId, CancellationToken ct)
    {
        var result = await _rtuContext.Monitorings
            .Where(x => x.BaselineId == baselineId && x.MonitoringPortId == monitoringPortId)
            .OrderByDescending(x => x.Id)
            .FirstOrDefaultAsync(ct);
        return result;
    }

    public async Task<byte[]?> GetLastMonitoringResultSor(int monitoringPortId, int baselineId, CancellationToken ct)
    {
        var lastMonitoring = await GetLastMonitoringResult(monitoringPortId, baselineId, ct);
        if (lastMonitoring == null)
        {
            return null;
        }
        
        return await GetSor(lastMonitoring.Id);
    }
}