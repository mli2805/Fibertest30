using System.Diagnostics;

namespace Fibertest30.Application;

public class AlarmProcessingContext
{
    private readonly List<MonitoringAlarm> _alarms;
    private readonly List<MonitoringChange> _changes;
    
    public List<AlarmMatch> ExistingAlarms { get; private set; } = null!;
    public List<MonitoringChange> AlarmsToAdd { get; private set; } = null!;
    public List<AlarmMatch> AlarmsToUpdate { get; private set; } = null!;
    public List<MonitoringAlarm> AlarmsToResolve { get; private set; } = null!;

    public AlarmProcessingContext(List<MonitoringAlarm> alarms, List<MonitoringChange> changes)
    {
        _alarms = alarms;
        _changes = changes;

        FillProcessingContext();
    }
    
    
    private void FillProcessingContext()
    {
        var matchGroup = GetMatchGroupCandidates();
        ExistingAlarms = GetBestMatches(matchGroup);
        
        AlarmsToUpdate = ExistingAlarms.Where(x => x.AlarmChanged).ToList();
        AlarmsToAdd = _changes.Except(ExistingAlarms.Select(x => x.Change)).ToList();
        AlarmsToResolve = GetAlarmsToResolve(ExistingAlarms);

#if DEBUG
        var ordered = ExistingAlarms.Zip(ExistingAlarms.Skip(1), (a, b) => new { a, b })
            .All(p => p.a.Alarm.DistanceMeters <= p.b.Alarm.DistanceMeters);
        if (!ordered) { throw new Exception("ExistingAlarms AlarmRecords not properly sorted"); }
#endif
    }

    private List<MonitoringAlarm> GetAlarmsToResolve(List<AlarmMatch> existingAlarms)
    {
        var alarmsToResolve = _alarms.Where(x => x.Status != MonitoringAlarmStatus.Resolved)
            .Except(existingAlarms.Select(x => x.Alarm)).ToList();
        return FilterByFiberBreakGrayZone(alarmsToResolve);
    }


    private AlarmMatchGroup GetMatchGroupCandidates()
    {
        var matchGroup = new AlarmMatchGroup();

        foreach (var change in _changes)
        {
            if (change.DistanceMeters == null)
            {
                var candidate = FindAlarmCandidate(change);
                if (candidate != null)
                {
                    matchGroup.AlarmMatches.Add(new AlarmMatch(candidate, change));
                }
            }
            else
            {
                var candidates = FindDistanceAlarmCandidates(change);
                foreach (var candidate in candidates)
                {
                    double metric = Math.Abs(candidate.DistanceMeters!.Value - change.DistanceMeters!.Value);
                    matchGroup.DistanceAlarmMatches.Add(new DistanceAlarmMatch(candidate, change, metric));
                }
            }
        }

        return matchGroup;
    }


    private MonitoringAlarm? FindAlarmCandidate(MonitoringChange change)
    {
        Debug.Assert(change.DistanceMeters == null);
        
        return _alarms.SingleOrDefault(x => x.DistanceMeters == null
                                            && x.Type == change.Type);
    }
    
    private List<MonitoringAlarm> FindDistanceAlarmCandidates(MonitoringChange change)
    {
        Debug.Assert(change.DistanceMeters != null);
        
        var candidatesQuery = _alarms.Where(x => x.Type == change.Type
                && x.DistanceMeters >= change.DistanceMeters - change.DistanceThresholdMeters 
                && x.DistanceMeters <= change.DistanceMeters + change.DistanceThresholdMeters);
            
            return candidatesQuery.ToList();
    }
    
    private List<AlarmMatch>  GetBestMatches(AlarmMatchGroup matchGroup)
    {
        var distanceMatches = GetBestDistancerMatches(matchGroup.DistanceAlarmMatches);
        return matchGroup.AlarmMatches.Concat(distanceMatches).ToList();
    }
    
    private List<AlarmMatch> GetBestDistancerMatches(List<DistanceAlarmMatch> distanceAlarmMatches)
    {
        // starts from the lowest metric
        distanceAlarmMatches = distanceAlarmMatches.OrderBy(x => x.Metric).ToList();
        
        var changeFlag = new HashSet<MonitoringChange>();
        var alarmFlag = new HashSet<MonitoringAlarm>();
        var result = new SortedList<double, AlarmMatch>(new DuplicateKeyComparer<double>());

        foreach (var match in distanceAlarmMatches)
        {
            if (!changeFlag.Contains(match.Change)
                && !alarmFlag.Contains(match.Alarm))
            {
                changeFlag.Add(match.Change);
                alarmFlag.Add(match.Alarm);
                AddIfNotBreakAlarmRecordOrder(result, match);
            }
        }

        return result.Values.ToList();
    }
    
    private void AddIfNotBreakAlarmRecordOrder(SortedList<double, AlarmMatch> result, AlarmMatch match)
    {
        result.Add(match.Change.DistanceMeters!.Value, match);
        var index = result.IndexOfValue(match);
        var left = index == 0 ? null : result.Values[index - 1];
        var right = index == result.Count - 1 ? null : result.Values[index + 1];

        if ((left != null && left.Alarm.DistanceMeters > match.Alarm.DistanceMeters)
            || (right != null && right.Alarm.DistanceMeters < match.Alarm.DistanceMeters))
        {
            result.RemoveAt(index); // don't add if it breaks AlarmRecord order. This means the change will be resolved
        }
    }
    
    private List<MonitoringAlarm> FilterByFiberBreakGrayZone(List<MonitoringAlarm> alarmsToResolve)
    {
        // We can't resolve any active alarm which have greater distance (consider distance threshold) than current FiberBreak
        // because those alarms just not visible anymore but still may exist
        
        // There should be only ONE FiberBreak at device at a time.
        var currentFiberBreakOnDevice = _changes.FirstOrDefault(x => x.Type == MonitoringAlarmType.FiberBreak);
        if (currentFiberBreakOnDevice != null)
        {
            return alarmsToResolve.Where(
             x => x.DistanceMeters == null 
             ||  x.DistanceMeters < (currentFiberBreakOnDevice.DistanceMeters - currentFiberBreakOnDevice.DistanceThresholdMeters))
                .ToList();
        }

        return alarmsToResolve;
    }
}


