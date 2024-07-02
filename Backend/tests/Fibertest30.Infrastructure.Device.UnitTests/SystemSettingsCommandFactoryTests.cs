namespace Fibertest30.Infrastructure.Device.UnitTests;

[TestClass]
public class SystemSettingsCommandFactoryTests
{
    [TestMethod]
    public void UpdateDnsServers()
    {
        var command = SystemSettingsCommandFactory.UpdateDnsServers("ipv6", null, null);
        command.Should().Be("rfts400config ipv6 -dns 0");
        var command2 = SystemSettingsCommandFactory.UpdateDnsServers("", "8.8.8.8", null);
        command2.Should().Be("rfts400config  -dns 1 8.8.8.8");
        var command3 = SystemSettingsCommandFactory.UpdateDnsServers("", "8.8.8.8", "9.9.9.9");
        command3.Should().Be("rfts400config  -dns 2 8.8.8.8 9.9.9.9");
    }

    [TestMethod]
    public void SetTimezone()
    {
        var command = SystemSettingsCommandFactory.SetTimezone("Europe/Berlin");
        command.Should()
            .Be("ln -sf /usr/share/zoneinfo/Europe/Berlin  /etc/localtime && echo \"Europe/Berlin\" > /etc/timezone");
    }
}
