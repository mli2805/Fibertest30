using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Fibertest30.Infrastructure;

public class MonitoringPortRepository : IMonitoringPortRepository
{
    public static readonly string  GetAllMonitoringPortsKey = "GetAllMonitoringPorts";
    
    private readonly RtuContext _rtuContext;
    private readonly IMemoryCache _cache;

    public MonitoringPortRepository(RtuContext rtuContext, 
        IMemoryCache cache)
    {
        _rtuContext = rtuContext;
        _cache = cache;
    }

    public async Task<List<MonitoringPort>> GetAllMonitoringPorts(CancellationToken ct)
    {
        if (_cache.TryGetValue<List<MonitoringPort>>(GetAllMonitoringPortsKey, out var cachedPorts))
        {
            return cachedPorts!;
        }

        var portsEf = await _rtuContext.MonitoringPorts.AsNoTracking()
            .Include(x => x.OtauPort)
            .Include(x => x.TimeSlots)
            .Include(x => x.Baseline)
            .ToListAsync(ct);
        var ports = portsEf.Select(x => x.FromEf()).ToList();
        _cache.Set(GetAllMonitoringPortsKey, ports);
        return ports;
    }

    public async Task<MonitoringPort> GetMonitoringPort(int monitoringPortId, CancellationToken ct)
    {
        var ports = await GetAllMonitoringPorts(ct);
        return ports.Single(x => x.Id == monitoringPortId);
    }
    
    public async Task<List<MonitoringPort>> GetOtauMonitoringPorts(int otauId, CancellationToken ct)
    {
        var ports = await GetAllMonitoringPorts(ct);
        return ports.Where(x => x.OtauId == otauId).ToList();
    }

    public async Task<MonitoringPort?> SetMonitoringPortStatus(int monitoringPortId, MonitoringPortStatus status, CancellationToken ct)
    {
        await using var transaction = await _rtuContext.Database.BeginTransactionAsync(ct);
        try
        {
            var portEf = _rtuContext.MonitoringPorts
                .Include(x => x.OtauPort)
                .Single(x => x.Id == monitoringPortId);
            if (portEf.Status == status)
            {
                return null;
            }
            
            // if trying to enable monitoring on OCM port
            if (status == MonitoringPortStatus.On && portEf.OtauPort.OtauId == OtauService.OcmOtauId)
            {
                var cascadeOtau = await _rtuContext.Otaus.SingleOrDefaultAsync(x => x.OcmPortIndex == portEf.OtauPort.PortIndex, ct);
                if (cascadeOtau != null)
                {
                    throw new Exception($"Can't enable monitoring for monitoringPortId ${monitoringPortId} because port is used for cascading");
                }
                
            }
        
            portEf.Status = status;
            await _rtuContext.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
            
            _cache.Remove(GetAllMonitoringPortsKey);
            return portEf.FromEf();

        }
        catch (Exception)
        {
            // ReSharper disable once MethodSupportsCancellation
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task SetLastRun(int monitoringPortId, DateTime lastRun, CancellationToken ct)
    {
        var portEf = new MonitoringPortEf{ Id = monitoringPortId, LastRun = lastRun };
        _rtuContext.Entry(portEf).Property(x => x.LastRun).IsModified = true;
        await _rtuContext.SaveChangesAsync(ct);
        
        _cache.Remove(GetAllMonitoringPortsKey);
    }

    public async Task SetBaseline(int monitoringPortId, int baselineId, CancellationToken ct)
    {
        var portEf = new MonitoringPortEf{ Id = monitoringPortId, BaselineId = baselineId };
        _rtuContext.Entry(portEf).Property(x => x.BaselineId).IsModified = true;
        await _rtuContext.SaveChangesAsync(ct);
        
        _cache.Remove(GetAllMonitoringPortsKey);
    }

    public Task<List<MonitoringTimeSlot>> GetMonitoringTimeSlots(CancellationToken ct)
    {
        var timeSlotsEf = _rtuContext.MonitoringTimeSlots.ToList();
        return Task.FromResult(timeSlotsEf.Select(x => x.FromEf()).ToList());
    }

    public async Task SetMonitoringPortSchedule(int monitoringPortId, MonitoringSchedulerMode mode, TimeSpan interval, List<int> timeSlotIds,
        CancellationToken ct)
    {
        await using var transaction = await _rtuContext.Database.BeginTransactionAsync(ct);
        try
        {
            var portEf = _rtuContext.MonitoringPorts
                .Include(x => x.TimeSlots)
                .Single(x => x.Id == monitoringPortId);
           
            portEf.SchedulerMode = mode;
            portEf.Interval = mode == MonitoringSchedulerMode.AtLeastOnceIn ? interval : null;

            if (mode == MonitoringSchedulerMode.FixedTimeSlot)
            {
                var timeSlots = _rtuContext.MonitoringTimeSlots.Where(x => timeSlotIds.Contains(x.Id)).ToList();
                if (timeSlots.Count != timeSlotIds.Count)
                {
                    throw new Exception("Invalid time slot ids");
                }
                if (timeSlots.Any(x => x.MonitoringPortId != null && x.MonitoringPortId != monitoringPortId))
                {
                    throw new Exception("Time slot is already used by another port");
                }

                portEf.TimeSlots = timeSlots;
            }
            else
            {
                portEf.TimeSlots = null;
            }
            
            await _rtuContext.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
            
            _cache.Remove(GetAllMonitoringPortsKey);
        }
        catch (Exception)
        {
            // ReSharper disable once MethodSupportsCancellation
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task SetMonitoringPortAlarmProfile(int monitoringPortId, int alarmProfileId, CancellationToken ct)
    {
        var portEf = new MonitoringPortEf{ Id = monitoringPortId, AlarmProfileId = alarmProfileId };
        _rtuContext.Entry(portEf).Property(x => x.AlarmProfileId).IsModified = true;
        await _rtuContext.SaveChangesAsync(ct);
        
        _cache.Remove(GetAllMonitoringPortsKey);
    }

    public async Task SetMonitoringPortNote(int monitoringPortId, string note, CancellationToken ct)
    {
        var portEf = new MonitoringPortEf{ Id = monitoringPortId, Note = note };
        _rtuContext.Entry(portEf).Property(x => x.Note).IsModified = true;
        await _rtuContext.SaveChangesAsync(ct);
        
        _cache.Remove(GetAllMonitoringPortsKey);
    }
}