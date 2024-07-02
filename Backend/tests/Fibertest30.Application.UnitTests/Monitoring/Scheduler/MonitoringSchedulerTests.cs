namespace Fibertest30.Application.UnitTests.Monitoring.Scheduler;

[TestClass]
public class MonitoringSchedulerTests
{
    private readonly SchedulerModelerDateTime _dateTime;

    public MonitoringSchedulerTests()
    {
        _dateTime = new SchedulerModelerDateTime();
    }

    [TestMethod]
    public void NullPortsThrowException()
    {
        var act = () => new MonitoringScheduler(null!, _dateTime);
        act.Should().Throw<ArgumentException>();
    }
    
    [TestMethod]
    public void EmptyPortsGivesInfinityDelay()
    {
        var scheduler = new MonitoringScheduler(new List<ScheduledPort>(), _dateTime);
        var first = scheduler.First();
        first.Port.Should().BeNull();
        first.Delay!.NextScheduleAt.Should().Be(ScheduledDelay.Infinity.NextScheduleAt);
    }
    
    [TestMethod]
    public void SingleAtLeastOnceInAlwaysRun()
    {
        var port = new AtLeastOnceInPort(1, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(10));
        AlwaysRun(port);
    }
    
    [TestMethod]
    public void SingleFixedTimeSlot_ThisDay()
    {
        var port = new FixedTimeSlotPort(1, TimeSpan.FromMinutes(1), new()
        {
            TimeSlot.Parse("12:00-12:30")
        });
        
        var results = GetScheduledResults(new() { port }, 3);
        var strResults = GetStringResult(results);
        strResults.Should().Be("01.12:00,1,02.12:00");
    }
    
    [TestMethod]
    public void SingleFixedTimeSlot_MultipleTimeSlots_ThisDay()
    {
        List<TimeSlot> timeSlots = new()
        {
            TimeSlot.Parse("12:00-12:30"),
            TimeSlot.Parse("17:00-17:30")
        };
        
        var port = new FixedTimeSlotPort(1, TimeSpan.FromMinutes(1), timeSlots);
        
        var ports = new List<ScheduledPort> { port };
        var results = GetScheduledResults(ports, 5);
        var strResults = GetStringResult(results);
        strResults.Should().Be("01.12:00,1,01.17:00,1,02.12:00");
    }
    
    [TestMethod]
    public void SingleFixedTimeSlot_NextDay()
    {
        var port = new FixedTimeSlotPort(1, TimeSpan.FromMinutes(1), new()
        {
            TimeSlot.Parse("09:00-10:00")
        });
        
        var ports = new List<ScheduledPort> { port };
        var results = GetScheduledResults(ports, 2);
        var strResults = GetStringResult(results);
        strResults.Should().Be("02.09:00,1");
    }

    [TestMethod]
    public void SingleRoundRobinAlwaysRun()
    {
        var port = new RoundRobinPort(1, TimeSpan.FromMinutes(1));
        AlwaysRun(port);
    }

    [TestMethod]
    public void MultipleAtLeastOnceIn_RoundRobin()
    {
        var ports = new List<ScheduledPort>
        {
            new AtLeastOnceInPort(1, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(10)),
            new AtLeastOnceInPort(2, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(20)),
            new AtLeastOnceInPort(3, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(30)),
        };
        RoundRobinRun(ports);
    }
    
    [TestMethod]
    public void MultipleRoundRobin_RoundRobin()
    {
        var ports = new List<ScheduledPort>
        {
            new RoundRobinPort(1, TimeSpan.FromMinutes(1)),
            new RoundRobinPort(2, TimeSpan.FromMinutes(1)),
            new RoundRobinPort(3, TimeSpan.FromMinutes(1)),
        };
        RoundRobinRun(ports);
    }
    
    [TestMethod]
    public void MixedAtLeastOnceInAndRoundRobin_RoundRobin()
    {
        var ports = new List<ScheduledPort>
        {
            new AtLeastOnceInPort(1, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(10)),
            new AtLeastOnceInPort(2, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(10)),
            new AtLeastOnceInPort(3, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(10)),
            new RoundRobinPort(4, TimeSpan.FromMinutes(1)),
            new RoundRobinPort(5, TimeSpan.FromMinutes(1)),
            new RoundRobinPort(6, TimeSpan.FromMinutes(1)),
        };
        RoundRobinRun(ports);
    }
    
    [TestMethod]
    public void AtLeastOnceInOutOfTime_StillRoundRobin()
    {
        var ports = new List<ScheduledPort>
        {
            new AtLeastOnceInPort(1, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1)),
            new AtLeastOnceInPort(2, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1)),
            new AtLeastOnceInPort(3, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1)),
        };
        RoundRobinRun(ports);
    }
    
    [TestMethod]
    public void AtLeastOnceInOutOfTime_RoundRobinIsNotCalled()
    {
        var ports = new List<ScheduledPort>
        {
            new AtLeastOnceInPort(1, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1)),
            new AtLeastOnceInPort(2, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1)),
            new AtLeastOnceInPort(3, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1)),
            new RoundRobinPort(4, TimeSpan.FromMinutes(1)),
        };
        
        var results = GetScheduledResults(ports, ports.Count * 3);
        var port4 = results.Where(x => x.Port!.MonitoringPortId == 4).ToList();
        port4.Count.Should().Be(0);
    }
    
    [TestMethod]
    public void AtLeastOnceInAndRoundRobin()
    {
        var ports = new List<ScheduledPort>
        {
            new AtLeastOnceInPort(1, TimeSpan.FromSeconds(10), TimeSpan.FromMinutes(1)),
            new AtLeastOnceInPort(2, TimeSpan.FromSeconds(10), TimeSpan.FromMinutes(2)),
            new RoundRobinPort(3, TimeSpan.FromSeconds(50))
        };

        var results = GetScheduledResults(ports, 8);
        var strResults = GetStringResult(results);
        strResults.Should().Be("1,2,1,3,1,2,1,3");
    }

    [TestMethod]
    public void MixedAll()
    {
        var ports = new List<ScheduledPort>
        {
            new AtLeastOnceInPort(1, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(10)),
            new AtLeastOnceInPort(2, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(10)),
            new FixedTimeSlotPort(3, TimeSpan.FromMinutes(1), new()
            {
                TimeSlot.Parse("10:10-10:20"),
                TimeSlot.Parse("10:30-10:40"),
            }),
            new FixedTimeSlotPort(4, TimeSpan.FromMinutes(1), new() { TimeSlot.Parse("10:20-10:30") }),
            new RoundRobinPort(5, TimeSpan.FromMinutes(1)),
            new RoundRobinPort(6, TimeSpan.FromMinutes(1)),
        };
        
        var results = GetScheduledResults(ports, 22);
        var strResults = GetStringResult(results);
        strResults.Should().Be("1,2,5,6,1,2,5,6,1,2,3,5,6,1,2,5,6,1,2,5,4,6" );
    }
    
    private void AlwaysRun(ScheduledPort port)
    {
        var testCount = 3;
        var results = GetScheduledResults(new() { port }, testCount);
        var strResults = GetStringResult(results);
        var expected = Enumerable.Range(0, testCount).Select(x => port.MonitoringPortId);
        strResults.Should().Be(string.Join(',', expected));
    }
    
    private void RoundRobinRun(List<ScheduledPort> ports)
    {
        var runs = ports.Count * 3;
        var results = GetScheduledResults(ports, runs);
        
        results.Should().HaveCount(runs);
        
        for (int i = 0; i < results.Count; i++)
        {
            results[i].Port!.Should().Be(ports[i % ports.Count]);
        }
    }

    private List<ScheduledNext> GetScheduledResults(List<ScheduledPort> ports, int count)
    {
        var scheduler = new MonitoringScheduler(ports, _dateTime);
        
        var results = scheduler
            .Select(next =>
            {
                if (next.Port != null)
                {
                    var lastRun = _dateTime.UtcNow;
                    _dateTime.Add(next.Port.TestTime);
                    next.Port.UpdateLastRun(lastRun, _dateTime.UtcNow);
                }

                if (next.Delay != null)
                {
                    _dateTime.Set(next.Delay.NextScheduleAt);
                }
                return next;
            })
            .Take(count).ToList();

        return results;
    }
   
    private string GetStringResult(List<ScheduledNext> results)
    {
        var strResults = results.Select(x =>
        {
            if (x.Port != null)
            {
                return x.Port.MonitoringPortId.ToString();
            }

            // do not care about seconds in tests
            return x.Delay!.NextScheduleAt.ToString("dd.HH:mm");
        }).ToList();
        
        return string.Join(',', strResults);
    }
}