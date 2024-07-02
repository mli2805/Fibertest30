namespace Fibertest30.Infrastructure.Device.UnitTests;

[TestClass]
public class NetworkSettingsParserTests
{
    [TestMethod]
    public void Parse1()
    {
        var output = File.ReadAllText(@"../../../ForParser/rfts400config.output");
        var result = NetworkSettingsParser.Parse(output);
        Assert.IsNotNull(result);
        result.NetworkMode.Should().Be("IPV4");
        result.LocalIpAddress.Should().Be("192.168.177.30");
        result.LocalSubnetMask.Should().Be("255.255.255.128");
        result.LocalGatewayIp.Should().Be("192.168.177.1");
        result.PrimaryDnsServer.Should().Be("8.8.8.8");
        result.SecondaryDnsServer.Should().BeNull();
    }

    [TestMethod]
    public void Parse2()
    {
        var output = File.ReadAllText(@"../../../ForParser/rfts400config.2.output");
        var result = NetworkSettingsParser.Parse(output);
        Assert.IsNotNull(result);
        result.NetworkMode.Should().Be("IPV4");
        result.LocalIpAddress.Should().Be("192.168.177.30");
        result.LocalSubnetMask.Should().Be("255.255.255.128");
        result.LocalGatewayIp.Should().Be("192.168.177.1");
        result.PrimaryDnsServer.Should().Be("8.8.8.8");
        result.SecondaryDnsServer.Should().Be("9.9.9.9");
    }
}
