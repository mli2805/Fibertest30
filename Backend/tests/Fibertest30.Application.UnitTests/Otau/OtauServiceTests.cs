using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;

namespace Fibertest30.Application.UnitTests;

[TestClass]
public class OtauServiceTests
{
    private readonly Mock<ILogger<OtauService>> _loggerMock = new();
    private readonly Mock<IDateTime> _dateTimeMock = new();
    private readonly Mock<IOtauController> _ocmControllerMock = new();
    private readonly Dictionary<int, Mock<IOtauController>> _osmControllerMockMap = new();
    private readonly Mock<IOtauRepository> _otauRepositoryMock = new();
    private readonly Mock<IOtauControllerFactory> _otauControllerFactoryMock = new();
    private readonly Mock<IServiceScopeFactory> _serviceScopeFactoryMock = new();
    private readonly Mock<ISystemEventSender> _systemEventSenderMock = new();
    
    private IOtauService _otauService;
    
    public OtauServiceTests()
    {

        _otauControllerFactoryMock.Setup(x => x.CreateOcm())
            .Returns(_ocmControllerMock.Object);
        
        _otauControllerFactoryMock.Setup(f => f.CreateOsm(It.IsAny<int>()))
            .Returns<int>(chainAddress => _osmControllerMockMap[chainAddress].Object);
        
        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock
            .Setup(x => x.GetService(typeof(IOtauRepository)))
            .Returns(_otauRepositoryMock.Object);
        
        var serviceScopeMock = new Mock<IServiceScope>();
        serviceScopeMock.Setup(x => x.ServiceProvider)
            .Returns(serviceProviderMock.Object);
        
        _serviceScopeFactoryMock.
            Setup(x => x.CreateScope())
            .Returns(serviceScopeMock.Object);
        
        _otauService = new OtauService(
            _loggerMock.Object,
            _dateTimeMock.Object,
            _otauControllerFactoryMock.Object,
            _serviceScopeFactoryMock.Object,
            _systemEventSenderMock.Object
            );
    }

    [TestMethod]
    public async Task Ocm_FirstStart_NoDiscover_CreateWithSinglePort()
    {
        SetupOtaus(null, null);

        await _otauService.Initialize(CancellationToken.None);
        
        VerifyOtauRepositoryAddOtau(OtauType.Ocm, OtauService.OcmOtauOcmPortIndex, 
            OtauService.VirtualOcmSerialNumber, 1, Times.Once());
        VerifyOtauRepositoryChangeOtau(Times.Never());
        VerifyOtauControllerConnect(_ocmControllerMock, Times.Never());
        await VerifyOtauMapCount(1);
    }

    [TestMethod]
    public async Task Ocm_FirstStart_Discover_Create()
    {
        var discoverOcm = new OtauDiscover
        {
            PortCount = 5, 
            SerialNumber = "discover ocm"
        };
        
        SetupOtaus(null, discoverOcm);

        await _otauService.Initialize(CancellationToken.None);
        
        VerifyOtauRepositoryAddOtau(OtauType.Ocm, OtauService.OcmOtauOcmPortIndex, 
            discoverOcm.SerialNumber, discoverOcm.PortCount, Times.Once());
        VerifyOtauRepositoryChangeOtau(Times.Never());
        VerifyOtauControllerConnect(_ocmControllerMock, Times.Once());
        await VerifyOtauMapCount(1);
    }
    
    [TestMethod]
    public async Task Ocm_Same_ChangeNothing()
    {
        var discoverOcm = new OtauDiscover
        {
            PortCount = 5, 
            SerialNumber = "discover ocm"
        };

        var otauEf = new Otau { Type = OtauType.Ocm, SerialNumber = discoverOcm.SerialNumber, };
        
        SetupOtaus(otauEf, discoverOcm);

        await _otauService.Initialize(CancellationToken.None);
        
        VerifyOtauRepositoryAddOtau(Times.Never());
        VerifyOtauRepositoryChangeOtau(Times.Never());
        VerifyOtauControllerConnect(_ocmControllerMock, Times.Once());
        await VerifyOtauMapCount(1);
    }

    [TestMethod]
    public async Task Ocm_Changed_ChangeCalled()
    {
        var otau = new Otau { Type = OtauType.Ocm, SerialNumber = "1", PortCount = 2 };
        var discover = new OtauDiscover { SerialNumber = "2", PortCount = 4 };

        SetupOtaus(otau, discover);
        
        await _otauService.Initialize(CancellationToken.None);
        
        VerifyOtauRepositoryAddOtau(Times.Never());
        VerifyOtauRepositoryChangeOtau(otau, discover.SerialNumber, discover.PortCount, Times.Once());
        VerifyOtauControllerConnect(_ocmControllerMock, Times.Once());
        await VerifyOtauMapCount(1);
    }
    
    [TestMethod]
    public async Task Osm_Changed_ChangeCalled()
    {
        var discover = new OtauDiscover
        {
            PortCount = 5, 
            SerialNumber = "new serial"
        };
    
        var osmParameters = new OsmOtauParameters(1);
        var otauEf = new Otau { 
            Id = 1,
            Type = OtauType.Osm, 
            OcmPortIndex = 1,
            SerialNumber = "old serial",
            Parameters = osmParameters
        };
    
        var osmSetup = new List<(Otau, OtauDiscover?)>() { (otauEf, discover) };
        SetupOtaus(null, null, osmSetup);
    
        await _otauService.Initialize(CancellationToken.None);
        
        VerifyOtauRepositoryAddOtau(Times.Exactly(1));
        VerifyOtauRepositoryChangeOtau(Times.Once());
        VerifyOtauControllerConnect(_osmControllerMockMap[osmParameters.ChainAddress], Times.Once());
        await VerifyOtauMapCount(2);
    }
    
    [TestMethod]
    public async Task Osm_Same_ChangeNothing()
    {
        var discover = new OtauDiscover
        {
            PortCount = 5, 
            SerialNumber = "discover osm"
        };

        var osmParameters = new OsmOtauParameters(1);
        var otauEf = new Otau { 
            Id = 1,
            Type = OtauType.Osm, 
            OcmPortIndex = 1,
            SerialNumber = discover.SerialNumber,
            Parameters = osmParameters
        };

        var osmSetup = new List<(Otau, OtauDiscover?)>() { (otauEf, discover) };
        SetupOtaus(null, null, osmSetup);

        await _otauService.Initialize(CancellationToken.None);
        
        VerifyOtauRepositoryAddOtau(Times.Exactly(1));
        VerifyOtauRepositoryChangeOtau(Times.Never());
        VerifyOtauControllerConnect(_osmControllerMockMap[osmParameters.ChainAddress], Times.Once());
        await VerifyOtauMapCount(2);
    }
    
    [TestMethod]
    public async Task Osm_NoDiscover()
    {
        var osmParameters = new OsmOtauParameters(1);
        var otauEf = new Otau { 
            Id = 1,
            Type = OtauType.Osm, 
            OcmPortIndex = 1,
            SerialNumber = "serial",
            Parameters = osmParameters
        };

        var osmSetup = new List<(Otau, OtauDiscover?)>() { (otauEf, null) };
        SetupOtaus(null, null, osmSetup);

        await _otauService.Initialize(CancellationToken.None);
        
        VerifyOtauRepositoryAddOtau(Times.Exactly(1));
        VerifyOtauRepositoryChangeOtau(Times.Never());
        VerifyOtauControllerConnect(_osmControllerMockMap[osmParameters.ChainAddress], Times.Never());
        await VerifyOtauMapCount(2);
    }

    private void SetupOtaus(
        Otau? currentOcm, OtauDiscover? discoverOcm,
        List<(Otau, OtauDiscover?)>? osmSetup = null)
    {
        var osmOtaus = osmSetup == null ? new List<Otau>() 
            : osmSetup.Select(x => x.Item1).ToList();
        
        
        _otauRepositoryMock.Setup(x => x.ReadOtaus(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Otaus()
            {
                OcmOtau = currentOcm,
                OsmOtaus = osmOtaus,
                OxcOtaus = new List<Otau>()
            });

        _ocmControllerMock.Setup(x => x.OtauType)
            .Returns(OtauType.Ocm);
        _ocmControllerMock.Setup(x => x.Discover(It.IsAny<CancellationToken>()))
            .ReturnsAsync(discoverOcm);

        if (osmSetup != null)
        {
            foreach (var osm in osmSetup)
            {
                var (osmOtau, osmDiscover) = osm;
                
                var chainAddress = ((OsmOtauParameters)osm.Item1.Parameters).ChainAddress;
                var controllerMock = new Mock<IOtauController>();
                _osmControllerMockMap[chainAddress] = controllerMock;

                controllerMock.Setup(x => x.OtauType)
                    .Returns(OtauType.Osm);
                controllerMock.Setup(x => x.Discover(It.IsAny<CancellationToken>()))
                    .ReturnsAsync(osmDiscover);
            }
        }


        var ocmAlwaysExist = currentOcm ?? new Otau()
        {
            Id = 0,
            SerialNumber = discoverOcm?.SerialNumber ?? OtauService.VirtualOcmSerialNumber,
            PortCount = discoverOcm?.PortCount ?? 1,
            Type = OtauType.Ocm
        };
        
        var otauMap = new Dictionary<int, Otau> { { 0, ocmAlwaysExist } };
        osmSetup?.ForEach(x => otauMap.Add(x.Item1.Id, x.Item1));
            
        _otauRepositoryMock.Setup(x => x.GetOtau(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((int id, CancellationToken token) => otauMap[id]);
    }
    
    private void VerifyOtauRepositoryAddOtau(
        OtauType type, int id, string serialNumber, int portCount, Times times)
    {
        _otauRepositoryMock.Verify(repo =>
                repo.AddOtau(
                    It.Is<OtauType>(x => x == type),
                    It.Is<int>(x => x == id),
                    It.Is<string>(x => x == serialNumber),
                    It.Is<int>(x => x == portCount),
                    It.IsAny<OcmOtauParameters>()),
            times);
    }
    
    private void VerifyOtauRepositoryAddOtau(Times times)
    {
        _otauRepositoryMock.Verify(repo =>
                repo.AddOtau(
                    It.IsAny<OtauType>(),
                    It.IsAny<int>(),
                    It.IsAny<string>(),
                    It.IsAny<int>(),
                    It.IsAny<OcmOtauParameters>()),
            times);
    }
    
    private void VerifyOtauRepositoryChangeOtau
        (Otau otau, string serialNumber, int portCount, Times times)
    {
        _otauRepositoryMock.Verify(repo =>
                repo.ChangeOtau(
                    It.Is<Otau>(x => x == otau),
                    It.Is<string>(x => x == serialNumber),
                    It.Is<int>(x => x == portCount),
                    It.IsAny<CancellationToken>()),
            times);
    }
    
    private void VerifyOtauRepositoryChangeOtau(Times times)
    {
        _otauRepositoryMock.Verify(x =>
                x.ChangeOtau(
                    It.IsAny<Otau>(),
                    It.IsAny<string>(),
                    It.IsAny<int>(),
                    It.IsAny<CancellationToken>()),
            times);
    }
    private void VerifyOtauControllerConnect(Mock<IOtauController> controllerMock, Times times)
    {
        controllerMock.Verify(x => x.Connect(It.IsAny<CancellationToken>()),
            times);
    }
    
    private async Task VerifyOtauMapCount(int count)
    {
        (await _otauService.GetAllOtau(CancellationToken.None)).Count.Should().Be(count);
    }

}