namespace Fibertest30.Application.UnitTests.Alarm;

public class AlarmProcessingBaseTests
{
    private const string _wrongTestChangesNotOrderedMessage = "WRONG TEST. Changes must be ordered";
    private List<MonitoringChange> Added { get; } = new();
    private List<AlarmMatch> Updated { get; } = new();
    private List<MonitoringAlarm> Resolved { get; } = new();

    protected List<MonitoringAlarm> Alarms = null!;

    private int _nextAlarmId = 1;




    public virtual void Init()
    {
        Alarms = new();
        ClearCounters();
    }

    protected void Assert_AddedAlarms(params MonitoringChange[] changes)
    {
        Assert.AreEqual(changes.Length, Added.Count);
        changes.ToList().ForEach(x =>
            Assert.IsTrue(Added.Find(y =>
                y.Type == x.Type
                && y.Level == x.Level
                && y.DistanceMeters == x.DistanceMeters) != null));
    }
    
    protected void Assert_AddedAlarms()
    {
        Assert.AreEqual(0, Added.Count);
    }
    
    protected void Assert_UpdatedAlarms(params MonitoringChange[] changes)
    {
        Assert.AreEqual(changes.Length, Updated.Count);
        changes.ToList().ForEach(x =>
            Assert.IsTrue(Updated.Find(y =>
                y.Change.Type == x.Type
                && y.Change.Level == x.Level
                && y.Change.DistanceMeters == x.DistanceMeters) != null));
    }
    
    protected void Assert_UpdatedAlarms()
    {
        Assert.AreEqual(0, Updated.Count);
    }

    protected void Assert_ResolvedAlarms(params MonitoringChange[] changes)
    {
        Assert.AreEqual(changes.Length, Resolved.Count);
        changes.ToList().ForEach(x =>
            Assert.IsTrue(Resolved.Find(y => y.Type == x.Type
                                             && y.Level == x.Level
                                             && y.DistanceMeters == x.DistanceMeters) != null));
    }

    protected void Assert_ResolvedAlarms()
    {
        Assert.AreEqual(0, Resolved.Count);
    }

    protected void ClearCounters()
    {
        Added.Clear();
        Updated.Clear();
        Resolved.Clear();
    }
   
    protected void ProcessAlarm(params MonitoringChange[] changes)
    {
        var sorted = changes.OrderBy(x => x.DistanceMeters);
        CollectionAssert.AreEqual(sorted.ToList(), changes.ToList(), _wrongTestChangesNotOrderedMessage);

        var ctx = new AlarmProcessingContext(Alarms, changes.ToList());
        ctx.AlarmsToAdd.ForEach(x =>
        {
            Added.Add(x);
            Alarms.Add(ChangeToAlarm(x));
        });
        
        ctx.AlarmsToUpdate.ForEach(x =>
        {
            Updated.Add(x);
            var alarm = Alarms.Single(y => y.Id == x.Alarm.Id);
            if (x.IsActiveAgain)
            {
                alarm.Status = MonitoringAlarmStatus.Active;
            }

            if (x.IsLevelChanged)
            {
                alarm.Level = x.Change.Level;
            }
        });

        ctx.AlarmsToResolve.ForEach(x =>
        {
            Resolved.Add(x);
            var alarm = Alarms.Single(y => y.Id == x.Id);
            alarm.Status = MonitoringAlarmStatus.Resolved;
        });
    }

    private MonitoringAlarm ChangeToAlarm(MonitoringChange change)
    {
        return new MonitoringAlarm
        {
            Id = _nextAlarmId++,
            Type = change.Type,
            Level = change.Level,
            DistanceMeters = change.DistanceMeters
        };
    }
}