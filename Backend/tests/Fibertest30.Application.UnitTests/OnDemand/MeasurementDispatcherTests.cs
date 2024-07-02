using Microsoft.Extensions.Logging;
using Moq;

namespace Fibertest30.Application.UnitTests.OnDemand;

[TestClass]
public class MeasurementDispatcherTests
{
    private Mock<ILogger<MeasurementDispatcher>> _loggerMock;
    private Mock<IMonitoringService> _monitoringMock;
    private Mock<IOnDemandService> _onDemandMock;
    private readonly Mock<IBaselineSetupService> _baselineSetupMock;
    private readonly IOtdrTasksService _otdrTasksService;
    private MeasurementDispatcher _dispatcher;
    // private readonly int _infinityDelayMock = 10000;

    public MeasurementDispatcherTests()
    {
        _loggerMock = new Mock<ILogger<MeasurementDispatcher>>();
        _monitoringMock = new Mock<IMonitoringService>();
        _onDemandMock = new Mock<IOnDemandService>();
        _baselineSetupMock = new Mock<IBaselineSetupService>();
        _otdrTasksService = new OtdrTasksService();
        _dispatcher = new MeasurementDispatcher(_loggerMock.Object, _otdrTasksService,
            _monitoringMock.Object, _onDemandMock.Object,
            _baselineSetupMock.Object);
        
        _onDemandMock.Setup(s => s.ProcessTask(It.IsAny<OtdrTask>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        
        _monitoringMock.Setup(s => s.ProcessTask(It.IsAny<OtdrTask>(),It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
    }

    // [TestMethod]
    // public async Task DoProcessMeasurements_CanBeStopped()
    // {
    //     // await to make sure DoProcessMeasurements is started
    //     await Task.Run(() =>
    //     {
    //         // fire and forget
    //         _dispatcher.ProcessMeasurements(CancellationToken.None);
    //     });
    //     
    //     _dispatcher.StopService();
    //     await _dispatcher.ServiceStopped.Task; // wait for DoProcessMeasurements to finish
    //     
    //     _dispatcher.ServiceStopped.Task.Status.Should().Be(TaskStatus.RanToCompletion);
    // }
    
    // [TestMethod]
    // public async Task ProcessMeasurements_ProcessesOnDemand()
    // {
    //     _otdrTaskChannelServiceMock.SetupSequence(s => s.WaitForData(It.IsAny<CancellationToken>()))
    //         .Returns(Task.CompletedTask);
    //     
    //     NoMonitoring();
    //     
    //     _dispatcher.Tests_ProcessOnlyCount = 1;
    //     await _dispatcher.ProcessMeasurements(CancellationToken.None);
    //
    //     _onDemandMock.Verify(s => s.ProcessTask(It.IsAny<OtdrTask>(), It.IsAny<CancellationToken>()), Times.Once);
    // }
    
    // [TestMethod]
    // public async Task ProcessMeasurements_ProcessMonitoring()
    // {
    //     _monitoringMock.SetupSequence(s => s.WaitForData(It.IsAny<CancellationToken>()))
    //         .Returns(Task.CompletedTask);
    //     
    //     _dispatcher.Tests_ProcessOnlyCount = 1;
    //     await _dispatcher.ProcessMeasurements(CancellationToken.None);
    //
    //     _monitoringMock.Verify(s => s.ProcessMonitoring(It.IsAny<CancellationToken>()), Times.Once);
    // }
    
    // [TestMethod]
    // public async Task ProcessMeasurements_OnDemandTakesPrecedence()
    // {
    //     _monitoringMock.Setup(s => s.WaitForData(It.IsAny<CancellationToken>()))
    //         .Returns(Task.CompletedTask);
    //
    //     _dispatcher.Tests_ProcessOnlyCount = 1;
    //     await _dispatcher.ProcessMeasurements(CancellationToken.None);
    //
    //     _monitoringMock.Verify(s => s.ProcessMonitoring(It.IsAny<CancellationToken>()), Times.Never);
    // }
    
    // [TestMethod]
    // public async Task ProcessMeasurements_OtdrTaskFirst()
    // {
    //     _monitoringMock.Setup(s => s.WaitForData(It.IsAny<CancellationToken>()))
    //         .Returns(async () =>
    //         {
    //             await Task.Delay(10);
    //         });
    //
    //     _dispatcher.Tests_ProcessOnlyCount = 1;
    //     await _dispatcher.ProcessMeasurements(CancellationToken.None);
    //
    //     _monitoringMock.Verify(s => s.ProcessMonitoring(It.IsAny<CancellationToken>()), Times.Never);
    // }

}