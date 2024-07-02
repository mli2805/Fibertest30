using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class MonitoringAlarmRepository : IMonitoringAlarmRepository
{
    private readonly RtuContext _rtuContext;
    private readonly IDateTime _dateTime;
    private readonly int _pageSize = 250;

    public MonitoringAlarmRepository(RtuContext rtuContext, IDateTime dateTime)
    {
        _rtuContext = rtuContext;
        _dateTime = dateTime;
    }

    public async Task<MonitoringAlarm> GetAlarmWithEvents(int alarmId, int? alarmGroupId,  CancellationToken ct)
    {
        var query = GetAlarmQuery(includeEvents: true, alarmGroupId);
        var alarmEf = await query.SingleAsync(x => x.Id == alarmId, ct);
        return alarmEf.FromEf();
    }

    public async Task<List<MonitoringAlarm>> GetAllActiveAlarms(bool includeEvents, CancellationToken ct)
    {
        var query = GetAlarmQuery(includeEvents);
        var alarmsEf = await query.Where(x => x.Status == MonitoringAlarmStatus.Active).ToListAsync(ct);
        var alarms = alarmsEf.Select(x => x.FromEf()).ToList();
        return alarms;
    }

    public async Task<List<MonitoringAlarm>> GetAllAlarms(List<int> portIds, bool includeEvents, CancellationToken ct)
    {
        var query = GetAlarmQuery(includeEvents);
        if (portIds.Any())
        {
            query = query.Where(m => portIds.Contains(m.MonitoringPortId));
        }

        query = query.OrderByDescending(a => a.Id);
        var alarms = await query.Take(_pageSize).Select(x => x.FromEf()).ToListAsync(ct);
        return alarms;
    }

    private IQueryable<MonitoringAlarmEf> GetAlarmQuery(bool includeEvents, int? alarmGroupId = null)
    {
        IQueryable<MonitoringAlarmEf> query = _rtuContext.Alarms;
        if (includeEvents)
        {
            if (alarmGroupId != null)
            {
                query = query.Include(x => x.Events!.Where(y => y.MonitoringAlarmGroupId == alarmGroupId));
            }
            else
            {
                query = query.Include(x => x.Events);
            }
        }
        
        return query;
    }

    public async Task<List<MonitoringAlarm>> GetMonitoringPortActiveAlarms(int monitoringPortId,
        CancellationToken ct)
    {
        var alarmEf = await _rtuContext.Alarms
            .Where(x => x.MonitoringPortId == monitoringPortId && x.Status == MonitoringAlarmStatus.Active)
            .ToListAsync(ct);
        var alarms = alarmEf.Select(x => x.FromEf()).ToList();
        return alarms;
    }

    public async Task<List<MonitoringAlarm>> GetMonitoringPortAlarms(int monitoringPortId,
        CancellationToken ct)
    {
        var alarmEf = await _rtuContext.Alarms
            .Where(x => x.MonitoringPortId == monitoringPortId)
            .ToListAsync(ct);
        var alarms = alarmEf.Select(x => x.FromEf()).ToList();
        return alarms;
    }

    public async Task<List<MonitoringAlarmEvent>> SaveAlarmProcessing(int monitoringPortId, int monitoringId, int baselineId,
        AlarmProcessingContext ctx, CancellationToken ct)
    {
        await using var transaction = await _rtuContext.Database.BeginTransactionAsync(CancellationToken.None);
        try
        {
            var now = _dateTime.UtcNow;
            var alarmEvents = new List<MonitoringAlarmEventEf>();

            AddNewAlarms(monitoringPortId, monitoringId, now, ctx.AlarmsToAdd, alarmEvents, ct);
            UpdateExistingAlarms(monitoringPortId, monitoringId, now, ctx.ExistingAlarms, alarmEvents);
            ResolveAlarms(monitoringPortId, monitoringId, now, ctx.AlarmsToResolve, alarmEvents);

            await _rtuContext.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);

            return alarmEvents.Select(x => x.FromEf()).ToList();
        }
        catch (Exception)
        {
            // ReSharper disable once MethodSupportsCancellation
            await transaction.RollbackAsync();
            throw;
        }
    }

    private void AddNewAlarms(int monitoringPortId, int monitoringId,
        DateTime now, List<MonitoringChange> alarmsToAdd, List<MonitoringAlarmEventEf> alarmEvents, CancellationToken ct)
    {
        foreach (var addAlarm in alarmsToAdd)
        {
            var alarmGroupId = GetNextAlarmGroupId();
            
            var alarm = new MonitoringAlarmEf()
            {
                AlarmGroupId = alarmGroupId,
                MonitoringPortId = monitoringPortId,
                MonitoringResultId = monitoringId,
                LastChangedAt = now,
                ActiveAt = now,
                Type = addAlarm.Type,
                Level = addAlarm.Level,
                Status = MonitoringAlarmStatus.Active,
                DistanceMeters = addAlarm.DistanceMeters,
                Change = addAlarm
            };

            var alarmEvent = new MonitoringAlarmEventEf
            {
                MonitoringAlarmGroupId = alarmGroupId,
                MonitoringPortId = monitoringPortId,
                MonitoringResultId = monitoringId,
                Type = addAlarm.Type,
                DistanceMeters = addAlarm.DistanceMeters,
                At = now,
                Status = MonitoringAlarmStatus.Active,
                Level = addAlarm.Level,
                Change = addAlarm
            };

            alarm.Events = new List<MonitoringAlarmEventEf> { alarmEvent };
            alarmEvents.Add(alarmEvent);
            _rtuContext.Alarms.Add(alarm);
        }
    }

    private void UpdateExistingAlarms(int monitoringPortId, int monitoringId, DateTime now,
        List<AlarmMatch> existingAlarms, List<MonitoringAlarmEventEf> alarmEvents)
    {
        foreach (var updateAlarm in existingAlarms)
        {
            var alarm = new MonitoringAlarmEf()
            {
                Id = updateAlarm.Alarm.Id,
                MonitoringResultId = monitoringId,
                DistanceMeters = updateAlarm.Change.DistanceMeters,
                Change = updateAlarm.Change
            };

            _rtuContext.Alarms.Attach(alarm);
            _rtuContext.Entry(alarm).Property(x => x.MonitoringResultId).IsModified = true;
            _rtuContext.Entry(alarm).Property(x => x.DistanceMeters).IsModified = true;
            _rtuContext.Entry(alarm).Property(x => x.Change).IsModified = true;

            if (updateAlarm.AlarmChanged)
            {
                alarm.LastChangedAt = now;
                _rtuContext.Entry(alarm).Property(x => x.LastChangedAt).IsModified = true;

                var alarmEvent = new MonitoringAlarmEventEf()
                {
                    MonitoringAlarmGroupId = updateAlarm.Alarm.AlarmGroupId,
                    MonitoringPortId = monitoringPortId,
                    MonitoringAlarmId = updateAlarm.Alarm.Id,
                    MonitoringResultId = monitoringId,
                    Type = updateAlarm.Change.Type,
                    DistanceMeters = updateAlarm.Change.DistanceMeters,
                    At = now,
                    Level = updateAlarm.Change.Level,
                    Status = updateAlarm.Alarm.Status,
                    Change = updateAlarm.Change
                };

                alarmEvents.Add(alarmEvent);
                _rtuContext.AlarmEvents.Add(alarmEvent);

                if (updateAlarm.IsLevelChanged)
                {
                    alarm.Level = updateAlarm.Change.Level;
                    _rtuContext.Entry(alarm).Property(x => x.Level).IsModified = true;
                    alarmEvent.OldLevel = updateAlarm.Alarm.Level;
                }

                if (updateAlarm.IsActiveAgain)
                {
                    var alarmGroupId = GetNextAlarmGroupId();

                    alarm.AlarmGroupId = alarmGroupId;
                    alarm.Status = MonitoringAlarmStatus.Active;
                    alarm.ActiveAt = now;
                    alarm.ResolvedAt = null;
                    _rtuContext.Entry(alarm).Property(x => x.AlarmGroupId).IsModified = true;
                    _rtuContext.Entry(alarm).Property(x => x.Status).IsModified = true;
                    _rtuContext.Entry(alarm).Property(x => x.ActiveAt).IsModified = true;
                    _rtuContext.Entry(alarm).Property(x => x.ResolvedAt).IsModified = true;

                    alarmEvent.MonitoringAlarmGroupId = alarmGroupId;
                    alarmEvent.OldStatus = updateAlarm.Alarm.Status;
                    alarmEvent.Status = MonitoringAlarmStatus.Active;
                }
            }
        }
    }
    private void ResolveAlarms(int monitoringPortId, int monitoringId, DateTime now,
        List<MonitoringAlarm> alarmsToResolve, List<MonitoringAlarmEventEf> alarmEvents)
    {
        foreach (var alarmToResolve in alarmsToResolve)
        {
            var alarm = new MonitoringAlarmEf()
            {
                Id = alarmToResolve.Id,
                LastChangedAt = now,
                ResolvedAt = now,
                MonitoringResultId = monitoringId,
                Status = MonitoringAlarmStatus.Resolved,
            };

            var alarmEvent = new MonitoringAlarmEventEf()
            {
                MonitoringAlarmGroupId = alarmToResolve.AlarmGroupId,
                MonitoringPortId = monitoringPortId,
                MonitoringAlarmId = alarmToResolve.Id,
                MonitoringResultId = monitoringId,
                Type = alarmToResolve.Type,
                DistanceMeters = alarmToResolve.DistanceMeters,
                At = now,
                OldStatus = alarmToResolve.Status,
                Status = MonitoringAlarmStatus.Resolved,
                Level = alarmToResolve.Level
            };

            _rtuContext.Alarms.Attach(alarm);
            _rtuContext.Entry(alarm).Property(x => x.LastChangedAt).IsModified = true;
            _rtuContext.Entry(alarm).Property(x => x.ResolvedAt).IsModified = true;
            _rtuContext.Entry(alarm).Property(x => x.MonitoringResultId).IsModified = true;
            _rtuContext.Entry(alarm).Property(x => x.Status).IsModified = true;

            alarmEvents.Add(alarmEvent);
            _rtuContext.AlarmEvents.Add(alarmEvent);
        }
    }
    
    private int GetNextAlarmGroupId()
    {
        // The idea is to rely on the database autogenerated column
        // We remove old and add a new stub row, just to get a new id
        
        var query = "INSERT OR REPLACE INTO AlarmGroupId (stub) VALUES(0);" +
                    "SELECT last_insert_rowid();";
        
        return _rtuContext.Database
            .SqlQueryRaw<int>(query)
            .ToList().Single();
    }
}