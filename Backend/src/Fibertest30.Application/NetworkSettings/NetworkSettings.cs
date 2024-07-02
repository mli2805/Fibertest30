namespace Fibertest30.Application;

public class NetworkSettings
{
    public string? NetworkMode { get; set; }

    public string? LocalIpAddress { get; set; }
    public string? LocalSubnetMask { get; set; }
    public string? LocalGatewayIp { get; set; }

    public string? PrimaryDnsServer { get; set; }
    public string? SecondaryDnsServer { get; set; }
}