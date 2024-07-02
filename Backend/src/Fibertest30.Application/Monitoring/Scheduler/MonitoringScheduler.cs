using System.Collections;

namespace Fibertest30.Application;

public interface IMonitoringScheduler : IEnumerable<ScheduledNext>
{
    public void SetPorts(List<ScheduledPort> ports);
    void UpdateLastRun(int monitoringPortId, DateTime lastRun);
}

public class MonitoringScheduler : IMonitoringScheduler
{
    private readonly IDateTime _dateTime;

    private readonly object _portsLock = new();
    private readonly Dictionary<int, ScheduledPort> _ports = new();
    private readonly Dictionary<int, FixedTimeSlotPort> _fixedTimeSlotPorts = new();
    
    public DateTime UtcNow => _dateTime.UtcNow;
    
    public MonitoringScheduler(IDateTime dateTime)
    {
        _dateTime = dateTime;
    }
    
    public MonitoringScheduler(List<ScheduledPort> ports, IDateTime dateTime)
    :this(dateTime)
    {
        SetPorts(ports);
    }

    public void SetPorts(List<ScheduledPort> ports)
    {
        if (ports == null) { throw new ArgumentException(nameof(ports));}

        lock (_portsLock)
        {
            RestoreLastRun(ports);

            _fixedTimeSlotPorts.Clear();
            _ports.Clear();
            
            ports.OfType<FixedTimeSlotPort>().ForEach(x => _fixedTimeSlotPorts.Add(x.MonitoringPortId, x));
            ports.Where(x => x is not FixedTimeSlotPort).ForEach(x => _ports.Add(x.MonitoringPortId, x));

            InitializeNextRun();                 
        }
    }

    private void RestoreLastRun(List<ScheduledPort> ports)
    {
        // as we are going to replace ports, we need to restore last run from the old ports
        // most of the time ScheduledPort will already have proper LastRun, but in case
        // ports are changing in a moment when the measurement already done, LastRun is updated in monitoring scheduler
        // but not yet updated in the database 
        foreach (var port in ports)
        {
            var lastRun = GetLastRun(port.MonitoringPortId);
            if (lastRun != null)
            {
                port.LastRun = lastRun.Value;
            }
        }
    }

    private DateTime? GetLastRun(int monitoringPortId)
    {
        lock (_portsLock)
        {
            if (_fixedTimeSlotPorts.TryGetValue(monitoringPortId, out var fixedTimeSlotPort))
            {
                return fixedTimeSlotPort.LastRun;
            }
            
            if (_ports.TryGetValue(monitoringPortId, out var scheduledPort))
            {
                return scheduledPort.LastRun;
            }

            return null;
        }
    }
 
    public void UpdateLastRun(int monitoringPortId, DateTime lastRun)
    {
        lock (_portsLock)
        {
            if (_fixedTimeSlotPorts.TryGetValue(monitoringPortId, out var fixedTimeSlotPort))
            {
                fixedTimeSlotPort.UpdateLastRun(lastRun, _dateTime.UtcNow);
            }
            
            if (_ports.TryGetValue(monitoringPortId, out var scheduledPort))
            {
                scheduledPort.UpdateLastRun(lastRun, _dateTime.UtcNow);
            }
        }
    }


    private void InitializeNextRun()
    {
        var now = _dateTime.UtcNow;
        _ports.Values.ForEach(x => x.UpdateNextRun(now));
        // scheduler anyway will recalculate next run for fixed ports before each iteration 
        // but let's keep UpdateNextRun here, so we could check next run right after creating the scheduler
        RecalculateFixedTimeSlotNextRun(now);
    }
    
    private void RecalculateFixedTimeSlotNextRun(DateTime now)
    {
        lock (_portsLock)
        {
            _fixedTimeSlotPorts.Values.ForEach(x => x.UpdateNextRun(now));
        }
    }

    public IEnumerator<ScheduledNext> GetEnumerator()
    {
        while (true)
        {
            if(IsNothingToRun())
            {
                yield return new ScheduledNext(ScheduledDelay.Infinity);
            }

            var now = _dateTime.UtcNow;
            
            var nextAtLeastOnceIn = GetNextAtLeastOnceIn();
            if (nextAtLeastOnceIn != null && now >= nextAtLeastOnceIn.NextRun)
            {
                // run the highest priority at-least-once-in port that is ready
                nextAtLeastOnceIn.SetLastRunBy(SchedulerLastRunBy.OnSchedule);
                yield return new ScheduledNext(nextAtLeastOnceIn);
            }
            else
            {
                // recalculate next run for fixed-time-slot ports before each iteration
                RecalculateFixedTimeSlotNextRun(now);
                
                var nextFixedTimeSlot = nextAtLeastOnceIn == null 
                    ? GetNextFixedTimeSlot(now) 
                    : GetNextFixedTimeSlot(now, nextAtLeastOnceIn);
                
                if (nextFixedTimeSlot != null && now >= nextFixedTimeSlot.NextRun)
                {
                    nextFixedTimeSlot.SetLastRunBy(SchedulerLastRunBy.OnSchedule);
                    yield return new ScheduledNext(nextFixedTimeSlot);
                }
                else
                {
                    // no priority ports are ready or exists
                    var next = nextAtLeastOnceIn == null 
                        ? GetNextRoundRobin(now) 
                        : GetNextRoundRobinOrAtLeastOnceIn(now, nextAtLeastOnceIn);

                    if (next is AtLeastOnceInPort)
                    {
                        next.SetLastRunBy(SchedulerLastRunBy.Boost);
                        yield return new ScheduledNext(next);
                    }
                    else if (next is RoundRobinPort)
                    {
                        next.SetLastRunBy(SchedulerLastRunBy.RoundRobin);
                        yield return new ScheduledNext(next);
                    }
                    else if (nextAtLeastOnceIn != null)
                    {
                        // boost  at-least-once-in that is closest to the schedule
                        nextAtLeastOnceIn.SetLastRunBy(SchedulerLastRunBy.Boost);
                        yield return new ScheduledNext(nextAtLeastOnceIn);
                    }
                    else if (nextFixedTimeSlot != null)
                    {
                        var fixedDelay = nextFixedTimeSlot.NextRun;
                        yield return new ScheduledNext(new ScheduledDelay(fixedDelay));
                    }                    
                }
            }
        }
    }



    private ScheduledPort? GetNextAtLeastOnceIn()
    {
        lock (_portsLock)
        {
            var next = _ports.Values.Where(x => x is AtLeastOnceInPort).MinBy(x => x.NextRun);
            return next;
        }
    }

    private ScheduledPort? GetNextFixedTimeSlot(DateTime now)
    {
        lock (_portsLock)
        {
            var next = _fixedTimeSlotPorts.Values.MinBy(x => x.NextRun);
            return next;
        }
    }
    
    private ScheduledPort? GetNextFixedTimeSlot(DateTime now, ScheduledPort nextPriority)
    {
        var availableWindow = nextPriority.NextRun - now;
        
        lock (_portsLock)
        {
            var next = _fixedTimeSlotPorts.Values
                .OrderBy(x => x.NextRun)
                .FirstOrDefault(x=> x.TestTime <= availableWindow);

            return next;
        }
    }

    private ScheduledPort? GetNextRoundRobinOrAtLeastOnceIn(DateTime now, ScheduledPort nextPriority)
    {
        var availableWindow = nextPriority.NextRun - now;
        
        lock (_portsLock)
        {
            var next = _ports.Values
                .OrderBy(x => x.LastRun)
                .FirstOrDefault(x => x == nextPriority || x.TestTime <= availableWindow);
            
            return next;
        }
    }
    
    private ScheduledPort? GetNextRoundRobin(DateTime now)
    {
        lock (_portsLock)
        {
            var next = _ports.Values.MinBy(x => x.LastRun);
            return next;
        }
    }

    public List<ScheduledPort> GetPorts()
    {
        lock (_portsLock)
        {
            return _ports.Values.Concat(_fixedTimeSlotPorts.Values).OrderBy(x => x.MonitoringPortId).ToList();
        }
    }

    private bool IsNothingToRun()
    {
        lock (_portsLock)
        {
            return _ports.Count == 0 && _fixedTimeSlotPorts.Count == 0;
        }
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}