namespace Fibertest30.Application.UnitTests.Alarm;

[TestClass]
public class AlarmProcessingContextTests : AlarmProcessingBaseTests
{
    [TestInitialize]
    public override void Init()
    {
        base.Init();
    }

    [TestMethod]
    public void AddFiberBreak()
    {
        ProcessAlarm(FiberBreak(20));

        Assert.AreEqual(1, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmType.FiberBreak, Alarms[0].Type);
        Assert.AreEqual(20, Alarms[0].DistanceMeters);

        //another changes nothing
        ProcessAlarm(FiberBreak(20));

        Assert.AreEqual(1, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmType.FiberBreak, Alarms[0].Type);
        Assert.AreEqual(20, Alarms[0].DistanceMeters);


        Assert_AddedAlarms(FiberBreak(20));
        Assert_ResolvedAlarms();
    }

    [TestMethod]
    public void AddRemoveBreakDetection()
    {
        ProcessAlarm(FiberBreak(20));
        ProcessAlarm();

        Assert_AddedAlarms(FiberBreak(20));
        Assert_ResolvedAlarms(FiberBreak(20));
    }

    [TestMethod]
    public void AddBreakDetectionWithLesserDistanceMeters()
    {
        ProcessAlarm(FiberBreak(30));
        ProcessAlarm(FiberBreak(20));
        ProcessAlarm(FiberBreak(10));

        Assert.AreEqual(3, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmType.FiberBreak, Alarms[0].Type);
        Assert.AreEqual(30, Alarms[0].DistanceMeters);

        Assert_AddedAlarms(FiberBreak(30), FiberBreak(20), FiberBreak(10));
        Assert_ResolvedAlarms();
    }

    [TestMethod]
    public void AddBreakDetectionWithGreaterDistanceMeters()
    {
        ProcessAlarm(FiberBreak(10));
        ProcessAlarm(FiberBreak(20));
        ProcessAlarm(FiberBreak(30));

        Assert_AddedAlarms(FiberBreak(10), FiberBreak(20), FiberBreak(30));
        Assert_ResolvedAlarms(FiberBreak(10), FiberBreak(20));
    }

    [TestMethod]
    public void AddBreakDetectionWithMixedDistanceMeters1()
    {
        ProcessAlarm(FiberBreak(20));
        ProcessAlarm(FiberBreak(10));
        ProcessAlarm(FiberBreak(30));

        Assert.AreEqual(3, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmStatus.Resolved, Alarms[0].Status);
        Assert.AreEqual(MonitoringAlarmStatus.Resolved, Alarms[1].Status);
        Assert.AreEqual(MonitoringAlarmStatus.Active, Alarms[2].Status);


        Assert_AddedAlarms(FiberBreak(20), FiberBreak(10), FiberBreak(30));
        Assert_ResolvedAlarms(FiberBreak(10), FiberBreak(20));
    }

    [TestMethod]
    public void AddBreakDetectionWithMixedDistanceMeters2()
    {
        ProcessAlarm(FiberBreak(30));
        ProcessAlarm(FiberBreak(10));
        ProcessAlarm(FiberBreak(20));

        Assert.AreEqual(3, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmStatus.Active, Alarms[0].Status);
        Assert.AreEqual(MonitoringAlarmStatus.Resolved, Alarms[1].Status);
        Assert.AreEqual(MonitoringAlarmStatus.Active, Alarms[2].Status);

        Assert_AddedAlarms(FiberBreak(30), FiberBreak(10), FiberBreak(20));
        Assert_ResolvedAlarms(FiberBreak(10));
    }

    [TestMethod]
    public void AddCriticalLoss()
    {
        ProcessAlarm(CriticalLoss(20));

        Assert.AreEqual(1, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmType.EventLoss, Alarms[0].Type);
        Assert.AreEqual(MonitoringAlarmLevel.Critical, Alarms[0].Level);
        Assert.AreEqual(20, Alarms[0].DistanceMeters);

        //another do nothing
        ProcessAlarm(CriticalLoss(20));

        Assert.AreEqual(1, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmType.EventLoss, Alarms[0].Type);
        Assert.AreEqual(MonitoringAlarmLevel.Critical, Alarms[0].Level);
        Assert.AreEqual(20, Alarms[0].DistanceMeters);

        Assert_AddedAlarms(CriticalLoss(20));
        Assert_ResolvedAlarms();
    }


    [TestMethod]
    public void AddCriticalLossThenMajorLoss()
    {
        ProcessAlarm(CriticalLoss(20));
        ProcessAlarm(MajorLoss(30));

        Assert.AreEqual(2, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmType.EventLoss, Alarms[0].Type);
        Assert.AreEqual(MonitoringAlarmStatus.Resolved, Alarms[0].Status);
        Assert.AreEqual(20, Alarms[0].DistanceMeters);        
        Assert.AreEqual(MonitoringAlarmLevel.Major, Alarms[1].Level);
        Assert.AreEqual(MonitoringAlarmStatus.Active, Alarms[1].Status);
        Assert.AreEqual(30, Alarms[1].DistanceMeters);

        Assert_AddedAlarms(CriticalLoss(20), MajorLoss(30));
        Assert_ResolvedAlarms(CriticalLoss(20));
    }

    [TestMethod]
    public void AddCriticalLossThenMajorLoss2()
    {
        ProcessAlarm(CriticalLoss(20), CriticalLoss(30));
        ProcessAlarm(CriticalLoss(30), MajorLoss(40));

        Assert.AreEqual(3, Alarms.Count);

        Assert_AddedAlarms(CriticalLoss(20), CriticalLoss(30), MajorLoss(40));
        Assert_ResolvedAlarms(CriticalLoss(20));
    }


    [TestMethod]
    public void AddTwoSimilarDistanceSequential()
    {
        ProcessAlarm(MajorLoss(20));

        Assert.AreEqual(1, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmType.EventLoss, Alarms[0].Type);
        Assert.AreEqual(20, Alarms[0].DistanceMeters);

        ProcessAlarm(MajorLoss(20.0001));

        Assert.AreEqual(1, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmType.EventLoss, Alarms[0].Type);
        Assert.AreEqual(20, Alarms[0].DistanceMeters);

        Assert_AddedAlarms(MajorLoss(20));
        Assert_ResolvedAlarms();
    }

    [TestMethod]
    public void AddTwoSimilarDistanceMetersParallel()
    {
        ProcessAlarm(MajorLoss(20), MajorLoss(20.0001));

        Assert.AreEqual(2, Alarms.Count);

        Assert_AddedAlarms(MajorLoss(20), MajorLoss(20.0001));
        Assert_ResolvedAlarms();
    }

    [TestMethod]
    public void DistanceMetersThreshold1()
    {
        SetDistanceMetersThreshold(20);

        ProcessAlarm(CriticalLoss(20), CriticalLoss(30), CriticalLoss(40));
        ProcessAlarm(CriticalLoss(26), CriticalLoss(30), CriticalLoss(40));

        Assert_AddedAlarms(CriticalLoss(20), CriticalLoss(30), CriticalLoss(40));
        Assert_ResolvedAlarms();
    }

    [TestMethod]
    public void DistanceMetersThreshold2()
    {
        SetDistanceMetersThreshold(20);

        ProcessAlarm(CriticalLoss(20));
        ProcessAlarm(CriticalLoss(26));

        Assert_AddedAlarms(CriticalLoss(20));
        Assert_ResolvedAlarms();
    }

    [TestMethod]
    public void DistanceMetersThreshold3()
    {
        SetDistanceMetersThreshold(20);

        ProcessAlarm(CriticalLoss(20), CriticalLoss(30), CriticalLoss(40));
        ProcessAlarm(CriticalLoss(26), CriticalLoss(37), CriticalLoss(40));

        Assert_AddedAlarms(CriticalLoss(20), CriticalLoss(30), CriticalLoss(40), CriticalLoss(37));
        Assert_ResolvedAlarms(CriticalLoss(20));
    }

    [TestMethod]
    public void DistanceMetersThreshold4()
    {
        SetDistanceMetersThreshold(20);

        ProcessAlarm(CriticalLoss(20), CriticalLoss(30), CriticalLoss(40));
        ProcessAlarm(CriticalLoss(26), CriticalLoss(27), CriticalLoss(40));

        Assert_AddedAlarms(CriticalLoss(20), CriticalLoss(30), CriticalLoss(40));
        Assert_ResolvedAlarms();
    }
    
    [TestMethod]
    public void FiberBreakDoNotResolveAlarmsOnTheRight1()
    {
        ProcessAlarm(CriticalLoss(20));
        ProcessAlarm(FiberBreak(19));

        Assert_AddedAlarms(CriticalLoss(20), FiberBreak(19));
        Assert_ResolvedAlarms();
    }
    
    [TestMethod]
    public void FiberBreakDoNotResolveAlarmsOnTheRight2()
    {
        ProcessAlarm(CriticalLoss(20), CriticalLoss(40));
        ProcessAlarm(CriticalLoss(20), FiberBreak(30));

        Assert_AddedAlarms(CriticalLoss(20), CriticalLoss(40), FiberBreak(30));
        Assert_ResolvedAlarms();
    }
    
    [TestMethod]
    public void FiberBreakDoNotResolveAlarmsOnTheRightWithThreshold1()
    {
        SetDistanceMetersThreshold(1);
        
        ProcessAlarm(CriticalLoss(20));
        ProcessAlarm(FiberBreak(20.5));

        Assert_AddedAlarms(CriticalLoss(20), FiberBreak(20.5));
        Assert_ResolvedAlarms();
    }
    
    [TestMethod]
    public void FiberBreakDoNotResolveAlarmsOnTheRightWithThreshold2()
    {
        SetDistanceMetersThreshold(1);
        
        ProcessAlarm(CriticalLoss(20));
        ProcessAlarm(FiberBreak(20));

        Assert_AddedAlarms(CriticalLoss(20), FiberBreak(20));
        Assert_ResolvedAlarms();
    }
    
    [TestMethod]
    public void FiberBreakResolveAlarmsThreshold()
    {
        SetDistanceMetersThreshold(1);
        
        ProcessAlarm(CriticalLoss(20));
        ProcessAlarm(FiberBreak(22));

        Assert_AddedAlarms(CriticalLoss(20), FiberBreak(22));
        Assert_ResolvedAlarms(CriticalLoss(20));
    }
    
    [TestMethod]
    public void LevelChanged()
    {
        ProcessAlarm(CriticalLoss(20));
        ProcessAlarm(MajorLoss(20));

        Assert.AreEqual(1, Alarms.Count);
        Assert.AreEqual(MonitoringAlarmLevel.Major, Alarms[0].Level);

        Assert_AddedAlarms(CriticalLoss(20));
        Assert_UpdatedAlarms(MajorLoss(20));
        Assert_ResolvedAlarms();
    }
    
    [TestMethod]
    public void ReActivateAlarm()
    {
        ProcessAlarm(CriticalLoss(20));
        Assert.AreEqual(Alarms[0].Status, MonitoringAlarmStatus.Active);

        ProcessAlarm();
        Assert.AreEqual(Alarms[0].Status, MonitoringAlarmStatus.Resolved);
        
        ProcessAlarm(CriticalLoss(20));
        Assert.AreEqual(Alarms[0].Status, MonitoringAlarmStatus.Active);

        Assert_AddedAlarms(CriticalLoss(20));
        Assert_UpdatedAlarms(CriticalLoss(20));
        Assert_ResolvedAlarms(CriticalLoss(20));
    }
}