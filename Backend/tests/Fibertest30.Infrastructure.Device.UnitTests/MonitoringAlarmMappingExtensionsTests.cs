

using Fibertest30.Application;
using Fibertest30.Infrastructure.Device.OtdrMeasEngine;
using Threshold = Fibertest30.Infrastructure.Device.OtdrMeasEngine.Threshold;

namespace Fibertest30.Infrastructure.Device.UnitTests;

[TestClass]
public class MonitoringAlarmMappingExtensionsTests
{
    [TestMethod]
    public void FiberBreakAlwaysGetsFiberBreakLevel()
    {
        var change = CreateChange(ChangeType.FiberBreak);
        
        change.GetAlarmLevel("critical").Should().Be(MonitoringAlarmLevel.Critical);
        change.GetAlarmLevel("minor").Should().Be(MonitoringAlarmLevel.Critical);
        change.GetAlarmLevel("major").Should().Be(MonitoringAlarmLevel.Critical);
    }
    
    [TestMethod]
    public void NewEventAlwaysGetsCriticalLevel()
    {
        var change = CreateChange(ChangeType.NewEvent);
        
        change.GetAlarmLevel("critical").Should().Be(MonitoringAlarmLevel.Critical);
        change.GetAlarmLevel("minor").Should().Be(MonitoringAlarmLevel.Critical);
        change.GetAlarmLevel("major").Should().Be(MonitoringAlarmLevel.Critical);
    }
    
    [TestMethod]
    public void NewEventAfterEofAlwaysGetsCriticalLevel()
    {
        var change = CreateChange(ChangeType.NewEventAfterEof);
        
        change.GetAlarmLevel("critical").Should().Be(MonitoringAlarmLevel.Critical);
        change.GetAlarmLevel("minor").Should().Be(MonitoringAlarmLevel.Critical);
        change.GetAlarmLevel("major").Should().Be(MonitoringAlarmLevel.Critical);
    }

    [TestMethod]
    public void MissingEventNotSupported()
    {
        var change = CreateChange(ChangeType.MissingEvent);

        var act = () => change.ToMonitoringChange("critical");
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [TestMethod]
    public void ToMonitoringChangesRemoveLevelDuplicates()
    {
        var change1 = CreateChange(ChangeType.ExceededThreshold, Threshold.EventLoss);

        var change2 = CreateChange(ChangeType.ExceededThreshold, Threshold.EventReflectance);

        var levels = new List<ChangesLevel>
        {
            new() { LevelName = "minor", Changes = new List<Change> { change1, change2 } },
            new() { LevelName = "major", Changes = new List<Change> { change1, change2 } },
            new() { LevelName = "critical", Changes = new List<Change> { change1 } },
        };

        var monitoringChanges = levels.ToMonitoringChanges();
        monitoringChanges.Count.Should().Be(2);
    }
    
    [TestMethod]
    public void ToMonitoringChangesOrderByLevelThenByDistance()
    {
        var change1 = CreateChange(ChangeType.ExceededThreshold, Threshold.EventReflectance, 1);
        var change2 = CreateChange(ChangeType.ExceededThreshold, Threshold.EventReflectance, 2);
        var fiberBreak = CreateChange(ChangeType.FiberBreak, null, 2.5);
        var change3 = CreateChange(ChangeType.ExceededThreshold, Threshold.EventReflectance, 3);
        var change4 = CreateChange(ChangeType.ExceededThreshold, Threshold.EventReflectance, 4);

        var levels = new List<ChangesLevel>
        {
            new() { LevelName = "minor", Changes = new List<Change> { change3, change2, change1, change4 } },
            new() { LevelName = "major", Changes = new List<Change> { change3, fiberBreak  } },
            new() { LevelName = "critical", Changes = new List<Change> { change4  } },
        };

        var monitoringChanges = levels.ToMonitoringChanges();
        monitoringChanges.Count.Should().Be(5);
        
        monitoringChanges[0].Level.Should().Be(MonitoringAlarmLevel.Critical);
        monitoringChanges[0].DistanceMeters.Should().Be(2.5);
        
        monitoringChanges[1].Level.Should().Be(MonitoringAlarmLevel.Critical);
        monitoringChanges[1].DistanceMeters.Should().Be(4);
        
        monitoringChanges[2].Level.Should().Be(MonitoringAlarmLevel.Major);
        monitoringChanges[2].DistanceMeters.Should().Be(3);
        
        monitoringChanges[3].Level.Should().Be(MonitoringAlarmLevel.Minor);
        monitoringChanges[3].DistanceMeters.Should().Be(1);
        
        monitoringChanges[4].Level.Should().Be(MonitoringAlarmLevel.Minor);
        monitoringChanges[4].DistanceMeters.Should().Be(2);
    }


    private Change CreateChange(ChangeType changeType, Threshold? threshold = null
        , double? locationMeters = null)
    {
        return new Change
        {
            ChangeType = changeType, 
            ExceededThreshold = threshold,
            ChangeLocation = locationMeters / 1000
        };
    }
}