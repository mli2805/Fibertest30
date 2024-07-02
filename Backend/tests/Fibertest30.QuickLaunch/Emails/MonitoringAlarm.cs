using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Fibertest30.Application;

namespace Fibertest30.HtmlTemplates;

[TestClass]
public class MonitoringAlarmTests
{
    private readonly IEmailBodyBuilder _bodyBuilder;

    public MonitoringAlarmTests()
    {
        Mock<IDeviceInfoProvider> mockDeviceInfoProvider = new();
        mockDeviceInfoProvider.Setup(x => x.GetSerialNumber()).Returns("TZNA02WA123456");
        mockDeviceInfoProvider.Setup(x => x.GetIpV4Address()).Returns("127.0.0.1");
        mockDeviceInfoProvider.Setup(x => x.GetTimeZone()).Returns(TimeZoneInfo.Utc);
        
        _bodyBuilder = new EmailBodyBuilder(mockDeviceInfoProvider.Object);
    }
    
    private static readonly DateTime _baseDateTime = new(2024, 3, 12, 11, 10, 20);

    private readonly OtauPortPath _portPath = new()
    {
        OcmOtauPort = new OtauPort { PortIndex = 3 }, CascadeOtauPort = new OtauPort { PortIndex = 8 }
    };
    
    private readonly MonitoringAlarm _activeAlarm = new()
    {
        Id = 1,
        Type = MonitoringAlarmType.EventLoss,
        Status = MonitoringAlarmStatus.Active,
        LastChangedAt = _baseDateTime.AddMinutes(22),
        DistanceMeters = 9765.43,
        Events = new List<MonitoringAlarmEvent>()
        {
            new ()
            {
                MonitoringAlarmId = 1,
                Type = MonitoringAlarmType.EventLoss,
                Status = MonitoringAlarmStatus.Active,
                Level = MonitoringAlarmLevel.Major,
                At = _baseDateTime.AddMinutes(11)
            },
            new ()
            {
                MonitoringAlarmId = 1,
                Type = MonitoringAlarmType.EventLoss,
                OldLevel = MonitoringAlarmLevel.Major,
                Level = MonitoringAlarmLevel.Critical,
                At =_baseDateTime.AddMinutes(33),
                Change = BuildChange(),
            },
        }
    };

    private static MonitoringChange BuildChange()
    {
        return new MonitoringChange
        {
            BaselineLeft =
                new MonitoringChangeKeyEvent { DistanceMeters = 8765.43, Comment = "Left event" },
            BaselineRight = new MonitoringChangeKeyEvent
            {
                DistanceMeters = 1200, Comment = "Right event"
            }
        };
    }

    [TestMethod]
    public void ActiveAlarmTest()
    {
        var content = _bodyBuilder.BuildEmailBody(_portPath, _activeAlarm);
        File.WriteAllText(@"..\..\..\Results\active-alarm.html", content);
    }

    [TestMethod]
    public void AlarmResolvedTest()
    {
        var resolvedAlarm = MakeResolvedAlarm();
        var content = _bodyBuilder.BuildEmailBody(_portPath, resolvedAlarm);
        File.WriteAllText(@"..\..\..\Results\resolved-alarm.html", content);
    }
    
    [TestMethod]
    public void AlarmActiveAgainTest()
    {
        var activeAgain = MakeActivaAgainAlarm();
        var content = _bodyBuilder.BuildEmailBody(_portPath, activeAgain);
        File.WriteAllText(@"..\..\..\Results\active-again-alarm.html", content);
    }

    private MonitoringAlarm MakeResolvedAlarm()
    {
        _activeAlarm.Status = MonitoringAlarmStatus.Resolved;
        _activeAlarm.ResolvedAt = _baseDateTime.AddMinutes(44);
        _activeAlarm.Events!.Add(new()
        {
            MonitoringAlarmId = 1,
            Type = MonitoringAlarmType.EventLoss,
            OldStatus = MonitoringAlarmStatus.Active,
            Status = MonitoringAlarmStatus.Resolved,
            At = _baseDateTime.AddMinutes(44)
        });

        return _activeAlarm;
    }

    private MonitoringAlarm MakeActivaAgainAlarm()
    {
        var resolvedAlarm = MakeResolvedAlarm();
        
        resolvedAlarm.Status = MonitoringAlarmStatus.Active;
        resolvedAlarm.ActiveAt = _baseDateTime.AddMinutes(55);
        resolvedAlarm.ResolvedAt = null;
        resolvedAlarm.Events!.Add(new()
        {
            MonitoringAlarmId = 1,
            Type = MonitoringAlarmType.EventLoss,
            OldLevel = MonitoringAlarmLevel.Major,
            Level = MonitoringAlarmLevel.Critical, // let's say it's active again, and change level since the last one
            OldStatus = MonitoringAlarmStatus.Resolved,
            Status = MonitoringAlarmStatus.Active,
            At = _baseDateTime.AddMinutes(55),
            Change = BuildChange()
        });

        return resolvedAlarm;
        
    }
}