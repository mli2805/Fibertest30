namespace Fibertest30.IntegrationTests.Persistence.PortLabel;

[TestClass]
public class PortLabelTests : SqliteTestBase
{
    private IPortLabelRepository _portLabelRepository = null!;
    
    [TestInitialize]
    public async Task TestInitialize()
    {
        _portLabelRepository = new PortLabelRepository(_rtuContext);
        
        await SeedUsingRtuContextInitializer();
    }

    [TestMethod]
    public async Task AddPortLabel_Ok()
    {
        await _portLabelRepository.AddAndAttachPortLabel("label", "#000000", 1, CancellationToken.None);
        var result = await _portLabelRepository.GetAll(CancellationToken.None);

        result.Count.Should().Be(1);
        result[0].Name.Should().Be("label");
        result[0].HexColor.Should().Be("#000000");
        result[0].MonitoringPortIds.Count.Should().Be(1);
        result[0].MonitoringPortIds[0].Should().Be(1);
    }
    
    [TestMethod]
    public async Task AddSamePortLabelName_Fail()
    {
        await _portLabelRepository.AddAndAttachPortLabel("label", "#000000", 1, CancellationToken.None);
        var act = async() => await _portLabelRepository.AddAndAttachPortLabel("label", "#000001", 2, CancellationToken.None);
        
        await act.Should().ThrowAsync<Exception>();
    }
    
    [TestMethod]
    public async Task UpdatePortLabel_Ok()
    {
        var portLabelId = await _portLabelRepository.AddAndAttachPortLabel("label", "#000000", 1, CancellationToken.None);
        
        await _portLabelRepository.UpdatePortLabel(portLabelId, "newLabel", "#111111", CancellationToken.None);
        
        var result = await _portLabelRepository.GetAll(CancellationToken.None);

        result.Count.Should().Be(1);
        result[0].Name.Should().Be("newLabel");
        result[0].HexColor.Should().Be("#111111");
        result[0].MonitoringPortIds.Count.Should().Be(1);
        result[0].MonitoringPortIds[0].Should().Be(1);
    }
    
    [TestMethod]
    public async Task UpdateUnknownPortLabel_Fail()
    {
        var act = async() => await _portLabelRepository.UpdatePortLabel(1, "label", "#000001", CancellationToken.None);
        
        await act.Should().ThrowAsync<Exception>();
    }
    
    [TestMethod]
    public async Task AddPortLabelSecondsTime_Fail()
    {
        await _portLabelRepository.AddAndAttachPortLabel("label", "#000000", 1, CancellationToken.None);
        var act = async () => await _portLabelRepository.AddAndAttachPortLabel("label", "#000000", 1, CancellationToken.None);

        await act.Should().ThrowAsync<Exception>();
    }

    [TestMethod]
    public async Task AttachPortLabel_Ok()
    {
        var portLabelId = await _portLabelRepository.AddAndAttachPortLabel("label", "#000000", 1, CancellationToken.None);
        await _portLabelRepository.AttachPortLabel(portLabelId, 2, CancellationToken.None);
        
        var result = await _portLabelRepository.GetAll(CancellationToken.None);
        result.Count.Should().Be(1);
        result[0].MonitoringPortIds.Count.Should().Be(2);
    }
    
    [TestMethod]
    public async Task AttachPortLabelSecondTime_Fail()
    {
        var portLabelId = await _portLabelRepository.AddAndAttachPortLabel("label", "#000000", 1, CancellationToken.None);
        await _portLabelRepository.AttachPortLabel(portLabelId, 2, CancellationToken.None);

        var act = async () => await _portLabelRepository.AttachPortLabel(portLabelId, 2, CancellationToken.None);
        await act.Should().ThrowAsync<Exception>();
    }

    [TestMethod]
    public async Task DetachPortLabel_Ok()
    {
        var portLabelId = await _portLabelRepository.AddAndAttachPortLabel("label", "#000000", 1, CancellationToken.None);
        await _portLabelRepository.AttachPortLabel(portLabelId, 2, CancellationToken.None);

        await _portLabelRepository.DetachPortLabelAndRemoveIfLast(portLabelId, 2, CancellationToken.None);
        
        var result = await _portLabelRepository.GetAll(CancellationToken.None);
        result.Count.Should().Be(1);
        result[0].MonitoringPortIds.Count.Should().Be(1);
    }

    [TestMethod]
    public async Task DetachLast_RemovePortLabel()
    {
        var portLabelId = await _portLabelRepository.AddAndAttachPortLabel("label", "#000000", 1, CancellationToken.None);

        await _portLabelRepository.DetachPortLabelAndRemoveIfLast(portLabelId, 1, CancellationToken.None);
        
        var result = await _portLabelRepository.GetAll(CancellationToken.None);
        result.Count.Should().Be(0);
    }

    [TestMethod]
    public async Task DetachUnknown_Fail()
    {
        var act = async () => await _portLabelRepository.DetachPortLabelAndRemoveIfLast(1, 1, CancellationToken.None);
        await act.Should().ThrowAsync<Exception>();
    }
}