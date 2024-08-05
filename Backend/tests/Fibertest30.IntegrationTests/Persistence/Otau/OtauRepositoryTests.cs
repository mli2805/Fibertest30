namespace Fibertest30.IntegrationTests.Persistence.Otau;

[TestClass]
public class OtauRepositoryTests : SqliteTestBase
{
    private readonly int OcmOtauTestPortCount = 4;
    private OtauRepository _otauRepository = null!;
    private MonitoringPortRepository _monitoringPortRepository = null!;
    
    [TestInitialize]
    public void TestInitialize()
    {
        _otauRepository = new OtauRepository(_rtuContext, _cache);
        _monitoringPortRepository = new MonitoringPortRepository(_rtuContext, _cache);
    }
    
    [TestMethod]
    public async Task AddOcmOtau_()
    {
        await AddOcmOtau();
        
        var after = await _otauRepository.ReadOtaus(CancellationToken.None);
        
        after.OsmOtaus.Should().BeEmpty();
        after.OxcOtaus.Should().BeEmpty();
        after.OcmOtau.Should().NotBeNull();
        after.OcmOtau!.Type.Should().Be(OtauType.Ocm);
        after.OcmOtau!.OcmPortIndex.Should().Be(0);
        after.OcmOtau!.SerialNumber.Should().Be("123");
        after.OcmOtau!.PortCount.Should().Be(OcmOtauTestPortCount);
        
        _rtuContext.MonitoringPorts.Count().Should().Be(OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count().Should().Be(OcmOtauTestPortCount);
    }
    
    [TestMethod]
    public async Task AddOcmOtau_AlwaysWithPredefinedOtauId()
    {
        var ocmId = await AddOcmOtau();
        ocmId.Should().Be(OtauService.OcmOtauId);

        await _otauRepository.RemoveOtau(ocmId, CancellationToken.None);
        
        // do it again
        ocmId = await AddOcmOtau();
        ocmId.Should().Be(OtauService.OcmOtauId);
    }

    private async Task<int> AddOcmOtau()
    {
        return await _otauRepository.AddOtau(OtauType.Ocm, OtauService.OcmOtauOcmPortIndex, "123", OcmOtauTestPortCount,
            new OcmOtauParameters());
    }

    [TestMethod]
    public async Task AddOsmOtau()
    {
        await AddOcmOtau();
        await _otauRepository.AddOtau(OtauType.Osm, 1, "123", OcmOtauTestPortCount, new OsmOtauParameters(1));
        
        var after = await _otauRepository.ReadOtaus(CancellationToken.None);

        after.OsmOtaus.Count().Should().Be(1);
        after.OxcOtaus.Should().BeEmpty();
        
        
        _rtuContext.MonitoringPorts.Count().Should().Be(4+OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count().Should().Be(4+OcmOtauTestPortCount);
    }
    
    [TestMethod]
    public async Task AddOtau_ToPortUnderMonitoring_Fail()
    {
        var ocmOtauPortIndex = 1;

        await AddOcmOtau();
        var ocmOtau = await _otauRepository.GetOtau(OtauService.OcmOtauId, CancellationToken.None);
        var port = ocmOtau.Ports.Single(x => x.PortIndex == ocmOtauPortIndex);
        await _monitoringPortRepository.SetMonitoringPortStatus(port.Id, MonitoringPortStatus.On, CancellationToken.None);
        
        var action = async () => await _otauRepository.AddOtau(OtauType.Osm, ocmOtauPortIndex, "123", OcmOtauTestPortCount, new OsmOtauParameters(1));
        await action.Should().ThrowAsync<Exception>();
    }
    
    [TestMethod]
    public async Task EnableMonitoring_OnCascadingPort_Fail()
    {
        // EnableMonitoring_OnCascadingPort_Fail is in OtauRepositoryTests
        // to be close to its counterpart AddOtau_ToPortUnderMonitoring_Fail
        
        var ocmOtauPortIndex = 1;

        await AddOcmOtau();
        await _otauRepository.AddOtau(OtauType.Osm, ocmOtauPortIndex, "123", OcmOtauTestPortCount, new OsmOtauParameters(1));
        
        var ocmOtau = await _otauRepository.GetOtau(OtauService.OcmOtauId, CancellationToken.None);
        var port = ocmOtau.Ports.Single(x => x.PortIndex == ocmOtauPortIndex);
        var action = async () => await _monitoringPortRepository.SetMonitoringPortStatus(port.Id, MonitoringPortStatus.On, CancellationToken.None);
        
        await action.Should().ThrowAsync<Exception>();
    }
    
    [TestMethod]
    public async Task ChangeOtau_MorePorts()
    {
        await AddOcmOtau();
        var otauId = await _otauRepository.AddOtau(OtauType.Osm, 1, "123", 4, new OsmOtauParameters(1));
        
        _rtuContext.MonitoringPorts.Count().Should().Be(4+OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count().Should().Be(4+OcmOtauTestPortCount);
        
        var otau = _rtuContext.Otaus.Single(x => x.Id == otauId);
        await _otauRepository.ChangeOtau(otau.FromEf(), "123", 6, CancellationToken.None);
        
        _rtuContext.MonitoringPorts.Count().Should().Be(6+OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count().Should().Be(6+OcmOtauTestPortCount);
    }
    
    [TestMethod]
    public async Task ChangeOtau_LessPorts()
    {
        await AddOcmOtau();
        var otauId = await _otauRepository.AddOtau(OtauType.Osm, 1, "123", 4, new OsmOtauParameters(1));
        
        _rtuContext.MonitoringPorts.Count().Should().Be(4+OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count().Should().Be(4+OcmOtauTestPortCount);
        
        var otau = _rtuContext.Otaus.Single(x => x.Id == otauId);
        await _otauRepository.ChangeOtau(otau.FromEf(), "123", 2, CancellationToken.None);
        
        _rtuContext.MonitoringPorts.Count().Should().Be(4+OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count().Should().Be(4+OcmOtauTestPortCount);

        _rtuContext.OtauPorts.Count(x => x.Unavailable).Should().Be(2);
    }
    
    [TestMethod]
    public async Task ChangeOtau_LessPortsThenTheSame()
    {
        await AddOcmOtau();
        var otauId = await _otauRepository.AddOtau(OtauType.Osm, 1, "123", 4, new OsmOtauParameters(1));
        
        var otau = _rtuContext.Otaus.Single(x => x.Id == otauId);
        await _otauRepository.ChangeOtau(otau.FromEf(), "123", 2, CancellationToken.None);
        
        otau= _rtuContext.Otaus.Single(x => x.Id == otauId);
        await _otauRepository.ChangeOtau(otau.FromEf(), "123", 4, CancellationToken.None);
        
        _rtuContext.MonitoringPorts.Count().Should().Be(4 + OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count().Should().Be(4 + OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count(x => x.Unavailable).Should().Be(0);
    }
    
    [TestMethod]
    public async Task ChangeOtau_LessPortsThenMore()
    {
        await AddOcmOtau();
        var otauId = await _otauRepository.AddOtau(OtauType.Osm, 1, "123", 4, new OsmOtauParameters(1));
        
        var otau = _rtuContext.Otaus.Single(x => x.Id == otauId);
        await _otauRepository.ChangeOtau(otau.FromEf(), "123", 2, CancellationToken.None);
        
        otau= _rtuContext.Otaus.Single(x => x.Id == otauId);
        await _otauRepository.ChangeOtau(otau.FromEf(), "123", 6, CancellationToken.None);
        
        _rtuContext.MonitoringPorts.Count().Should().Be(6+OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count().Should().Be(6+OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count(x => x.Unavailable).Should().Be(0);
    }
    
    [TestMethod]
    public async Task RemoveOtauRemoveOtauPortAndMonitoringPorts()
    {
        await AddOcmOtau();
        var otauId = await _otauRepository.AddOtau(OtauType.Osm, 1, "123", 4, new OsmOtauParameters(1));
         await _otauRepository.RemoveOtau(otauId, CancellationToken.None);
        
        _rtuContext.MonitoringPorts.Count().Should().Be(0+OcmOtauTestPortCount);
        _rtuContext.OtauPorts.Count().Should().Be(0+OcmOtauTestPortCount);
    }
}