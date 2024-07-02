using Fibertest30.Domain;

namespace Fibertest30.IntegrationTests.Persistence.Alarm;

[TestClass]
public class MonitoringAlarmRepositoryTests : SqliteTestBase
{
    private MonitoringAlarmRepository _alarmRepository = null!;
    private BaselineRepository _baselineRepository = null!;
    private IDateTime _dateTime = null!;
    private string _userId = null!;
    private MonitoringRepository _monitoringRepository = null!;

    [TestInitialize]
    public async Task TestInitialize()
    {
        _dateTime = new TestDateTime();
        _alarmRepository = new MonitoringAlarmRepository(_rtuContext, _dateTime);
        _baselineRepository = new BaselineRepository(_rtuContext);
        _monitoringRepository = new MonitoringRepository(_rtuContext, _dateTime);
        
        await SeedUsingRtuContextInitializer();
        _userId = _userManager.Users.First().Id;
    }

    [TestMethod]
    public async Task ReactivatedAlarmGetsNewAlarmGroupId()
    {
        // seed some requirements
        await _baselineRepository.Add(1, _dateTime.UtcNow, _userId, new MeasurementSettings(), 
            Array.Empty<byte>(),
            CancellationToken.None);
        await _monitoringRepository.Add(
            new MonitoringResult { MonitoringPortId = 1, BaselineId = 1,
                MeasurementSettings = new MeasurementSettings(),
                Changes = new List<MonitoringChange>()
            });
        
        
        // add an alarm
        var ctx = new AlarmProcessingContext(
            new List<MonitoringAlarm> { },
            new List<MonitoringChange> { MajorLoss(20) });

        _rtuContext.ChangeTracker.Clear(); // clear the context to avoid getting tracked entities
        await _alarmRepository.SaveAlarmProcessing(1, 1, 1, ctx, CancellationToken.None);
        _rtuContext.ChangeTracker.Clear();
        var alarms = await _alarmRepository.GetAllAlarms(new List<int>(), true, CancellationToken.None);

        alarms.Count.Should().Be(1);
        alarms[0].Events!.Count.Should().Be(1);
        alarms[0].AlarmGroupId.Should().Be(1);
        alarms[0].Events![0].MonitoringAlarmGroupId.Should().Be(1);

        // resolve the alarm
        ctx = new AlarmProcessingContext(
            new List<MonitoringAlarm> { alarms[0] },
            new List<MonitoringChange> { });

        _rtuContext.ChangeTracker.Clear();
        await _alarmRepository.SaveAlarmProcessing(1, 1, 1, ctx, CancellationToken.None);
        _rtuContext.ChangeTracker.Clear();
        alarms = await _alarmRepository.GetAllAlarms(new List<int>(), true, CancellationToken.None);

        alarms.Count.Should().Be(1);
        alarms[0].Events!.Count.Should().Be(2);
        alarms[0].AlarmGroupId.Should().Be(1);
        alarms[0].Events![0].MonitoringAlarmGroupId.Should().Be(1);
        alarms[0].Events![1].MonitoringAlarmGroupId.Should().Be(1);

        // reactivate the alarm
        ctx = new AlarmProcessingContext(
            new List<MonitoringAlarm> { alarms[0] },
            new List<MonitoringChange> { MajorLoss(20) });

        _rtuContext.ChangeTracker.Clear();
        await _alarmRepository.SaveAlarmProcessing(1, 1, 1, ctx, CancellationToken.None);
        _rtuContext.ChangeTracker.Clear();
        alarms = await _alarmRepository.GetAllAlarms(new List<int>(), true, CancellationToken.None);

        alarms.Count.Should().Be(1);
        alarms[0].Events!.Count.Should().Be(3);
        alarms[0].AlarmGroupId.Should().Be(2);
        alarms[0].Events![0].MonitoringAlarmGroupId.Should().Be(1);
        alarms[0].Events![1].MonitoringAlarmGroupId.Should().Be(1);
        alarms[0].Events![2].MonitoringAlarmGroupId.Should().Be(2);
    }
}