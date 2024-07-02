using Fibertest30.Domain;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;


namespace Fibertest30.Application.UnitTests.OnDemand;

[TestClass]
public class OnDemandServiceTests
{
    private Mock<ILogger<IOnDemandService>> _loggerMock;
    private Mock<IOtdr> _otdrMock;
    private Mock<IOtauService> _otauServiceMock;
    private Mock<ILogger<MeasurementService>> _measurementLoggerMock;
    private Mock<IOnDemandRepository> _onDemandRepositoryMock;
    private Mock<IServiceScopeFactory> _serviceScopeFactoryMock;
    private Mock<ISystemEventSender> _systemEventSenderMock;
    private IOtdrTasksService _otdrTasksService;
    private IMeasurementService _measurement;
    private IOnDemandService _onDemandService;
    private string UserId => "userId";
    private int MonitoringPortId => 0;
    private MeasurementSettings MeasurementSettings => new MeasurementSettings();
    private bool _cancelMeasurement;

    public OnDemandServiceTests()
    {
        _loggerMock = new Mock<ILogger<IOnDemandService>>();
        _otdrMock = new Mock<IOtdr>();
        _otauServiceMock = new Mock<IOtauService>();
        _measurementLoggerMock = new Mock<ILogger<MeasurementService>>();
        _onDemandRepositoryMock = new Mock<IOnDemandRepository>();
        _otdrTasksService = new OtdrTasksService();
        
        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock
            .Setup(x => x.GetService(typeof(IOnDemandRepository)))
            .Returns(_onDemandRepositoryMock.Object);
        
        var serviceScopeMock = new Mock<IServiceScope>();
        serviceScopeMock.Setup(x => x.ServiceProvider)
            .Returns(serviceProviderMock.Object);
        
        _serviceScopeFactoryMock = new Mock<IServiceScopeFactory>();
        _serviceScopeFactoryMock.
            Setup(x => x.CreateScope())
            .Returns(serviceScopeMock.Object);

        _systemEventSenderMock = new Mock<ISystemEventSender>();
        
        _measurement = new MeasurementService(_otdrMock.Object, _otauServiceMock.Object, _measurementLoggerMock.Object);
        _onDemandService = new OnDemandService(
            _loggerMock.Object, 
            new DateTimeService(),
            _measurement,
            _serviceScopeFactoryMock.Object,
            _otdrTasksService,
            _systemEventSenderMock.Object);

        _otdrMock.Setup(x => x.Measure(
                It.IsAny<bool>(),
                It.IsAny<OtdrTraceFiberParameters>(),
                It.IsAny<OtdrTraceAnalysisParameters>(),
                It.IsAny<OtdrTraceSpanParameters>(),
                It.IsAny<OtdrTraceManualMeasurementParameters>(),
                It.IsAny<CancellationToken>()))
            .Returns(GetMeasures());
    }
    
    private async IAsyncEnumerable<OtdrTraceMeasurementResult>  GetMeasures()
    {
        yield return new OtdrTraceMeasurementResult() { Progress = 0.4 };
        await Task.Delay(100); // give test time to cancel
        if (!_cancelMeasurement)
        {
            yield return new OtdrTraceMeasurementResult() { Progress = 0.8 };
            yield return new OtdrTraceMeasurementResult() { Progress = 1.0, Sor=new byte[1] { 0x16 } };
        }
    }
    
    [TestMethod]
    public async Task StartOnDemand_AddedToQueue()
    {
        var onDemandTask = await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        onDemandTask.Id.Should().NotBeNullOrEmpty();

        var onDemand =_onDemandService.GetUserOnDemand(UserId);
        onDemand.Should().NotBeNull();
    }
    
    [TestMethod]
    public async Task StartOnDemand_SetPendingStatus()
    {
        await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        var onDemand =_onDemandService.GetUserOnDemand(UserId)!;
        onDemand.Status.Should().Be(OtdrTaskStatus.Pending);
    }
    
    [TestMethod]
    public async Task StartOnDemand_OnlyOnePerUser()
    {
        await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        Func<Task> secondStart = async () => await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        await secondStart.Should().ThrowAsync<Exception>();
    }
    
    [TestMethod]
    public async Task StartOnDemand_QueuedForDifferentUsers()
    {
        await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        Func<Task> secondStart = async () => await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, "AnotherUserId", CancellationToken.None);
        await secondStart.Should().NotThrowAsync<Exception>();
    }

    [TestMethod]
    public async Task StopOnDemand_RemovesFromOnDemands()
    {
        var onDemand = await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        _onDemandService.GetUserOnDemandId(UserId).Should().NotBeNull();
        
        await _onDemandService.CancelTask(onDemand.Id, UserId, CancellationToken.None);
        _onDemandService.GetUserOnDemandId(UserId).Should().BeNull();
    }
    
    [TestMethod]
    public async Task StopOnDemand_SetCancelledStatus()
    {
        var onDemandTask = await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        var onDemand =_onDemandService.GetUserOnDemand(UserId)!;

        await _onDemandService.CancelTask(onDemandTask.Id, UserId, CancellationToken.None);
        onDemand.Status.Should().Be(OtdrTaskStatus.Cancelled);

    }

    [TestMethod]
    public async Task OnDemand_StartAndComplete()
    {
        var onDemand = await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        var progressAsync = _onDemandService.ObserveProgress(onDemand.Id)!
            .ToAsyncEnumerable().ToListAsync();
        await _onDemandService.ProcessTask(onDemand, CancellationToken.None);
        var progress = await progressAsync;

        progress.Count.Should().Be(5);
        progress[0].Should().Be(CreateProgress(OtdrTaskStatus.Running, 0));
        progress[1].Should().Be(CreateProgress(OtdrTaskStatus.Running, 0.4));
        progress[2].Should().Be(CreateProgress(OtdrTaskStatus.Running, 0.8));
        progress[3].Should().Be(CreateProgress(OtdrTaskStatus.Running, 1));
        progress[4].Status.Should().Be(OtdrTaskStatus.Completed.ToString());
        progress[4].Progress.Should().Be(1);

    }

    private OtdrTaskProgress CreateProgress(OtdrTaskStatus status, double progress, int queuePosition = 0, string stepName = "")
    {
        var completedAt = status == OtdrTaskStatus.Completed ? new DateTime(2024,03,10) : DateTime.MinValue;
        return new OtdrTaskProgress(queuePosition, status.ToString(), progress, completedAt, stepName);
    }

    [TestMethod]
    public async Task OnDemand_StartAndCancel()
    {
        var onDemand = await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        var progressAsync = _onDemandService.ObserveProgress(onDemand.Id)!
            .ToAsyncEnumerable().ToListAsync();
        var processOnDemand = _onDemandService.ProcessTask(onDemand, CancellationToken.None);
        await _onDemandService.CancelTask(onDemand.Id, UserId, CancellationToken.None);
        _cancelMeasurement = true; // cancel measurement
        
        var progress = await progressAsync;

        progress.Count.Should().Be(3);
        progress[0].Should().Be(CreateProgress(OtdrTaskStatus.Running, 0));
        progress[1].Should().Be(CreateProgress(OtdrTaskStatus.Running, 0.4));
        progress[2].Should().Be(CreateProgress(OtdrTaskStatus.Cancelled, 0.4));
    }
    
    [TestMethod]
    public async Task OnDemand_StartSecondAndComplete()
    {
        var onDemand1 = await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, "AnotherUserId", CancellationToken.None);
        
        var onDemand2 = await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        var progressAsync = _onDemandService.ObserveProgress(onDemand2.Id)!
            .ToAsyncEnumerable().ToListAsync();
        
        // first measurement
        await _onDemandService.ProcessTask(onDemand1, CancellationToken.None);
        // second measurement
        await _onDemandService.ProcessTask(onDemand2, CancellationToken.None);
        
        
        var progress = await progressAsync;
    
        progress.Count.Should().Be(6);
        progress[0].Should().Be(CreateProgress(OtdrTaskStatus.Pending, 0, queuePosition:1));
        progress[1].Should().Be(CreateProgress(OtdrTaskStatus.Running, 0));
        progress[2].Should().Be(CreateProgress(OtdrTaskStatus.Running, 0.4));
        progress[3].Should().Be(CreateProgress(OtdrTaskStatus.Running, 0.8));
        progress[4].Should().Be(CreateProgress(OtdrTaskStatus.Running, 1));
        progress[5].Status.Should().Be(OtdrTaskStatus.Completed.ToString());
        progress[5].Progress.Should().Be(1);
    }
    
    [TestMethod]
    public async Task OnDemand_StartAndMeasureFailed()
    {
        _otdrMock.Setup(x => x.Measure(
                It.IsAny<bool>(),
                It.IsAny<OtdrTraceFiberParameters>(),
                It.IsAny<OtdrTraceAnalysisParameters>(),
                It.IsAny<OtdrTraceSpanParameters>(),
                It.IsAny<OtdrTraceManualMeasurementParameters>(),
                It.IsAny<CancellationToken>()))
            .Throws<Exception>();
            
        var onDemand = await _onDemandService.StartOnDemand(MonitoringPortId, MeasurementSettings, UserId, CancellationToken.None);
        var progressAsync = _onDemandService.ObserveProgress(onDemand.Id)!
             .ToAsyncEnumerable().ToListAsync();
        await _onDemandService.ProcessTask(onDemand, CancellationToken.None);

        var progress = await progressAsync;
        
         progress.Count.Should().Be(2);
         progress[0].Should().Be(CreateProgress(OtdrTaskStatus.Running, 0));
         progress[1].Should().Be(CreateProgress(OtdrTaskStatus.Failed, 0));
    }
}