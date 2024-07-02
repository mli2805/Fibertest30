namespace Fibertest30.Api;

public static class SystemSettingsMappingExtensions
{
    public static NetworkSettings ToProto(this Application.NetworkSettings settings)
    {
        NetworkSettings proto = new()
        {
            NetworkMode = settings.NetworkMode,

            LocalIpAddress = settings.LocalIpAddress,
            LocalSubnetMask = settings.LocalSubnetMask,
            LocalGatewayIp = settings.LocalGatewayIp,
        };

        if (settings.PrimaryDnsServer != null)
            proto.PrimaryDnsServer = settings.PrimaryDnsServer;
        if (settings.SecondaryDnsServer != null)
            proto.SecondaryDnsServer = settings.SecondaryDnsServer;
        return proto;
    }

    public static Application.NetworkSettings FromProto(this NetworkSettings proto)
    {
        Application.NetworkSettings settings = new()
        {
            NetworkMode = proto.NetworkMode,

            LocalIpAddress = proto.LocalIpAddress,
            LocalSubnetMask = proto.LocalSubnetMask,
            LocalGatewayIp = proto.LocalGatewayIp,

            PrimaryDnsServer = proto.PrimaryDnsServer,
            SecondaryDnsServer = proto.SecondaryDnsServer,
        };

        if (proto.PrimaryDnsServer != null) settings.PrimaryDnsServer = proto.PrimaryDnsServer;
        if (proto.SecondaryDnsServer != null) settings.SecondaryDnsServer = proto.SecondaryDnsServer;

        return settings;
    }

    public static NtpSettings ToProto(this Application.NtpSettings settings)
    {
        NtpSettings proto = new NtpSettings();
        if (settings.PrimaryNtpServer != null) proto.PrimaryNtpServer = settings.PrimaryNtpServer;
        if (settings.SecondaryNtpServer != null) proto.SecondaryNtpServer = settings.SecondaryNtpServer;
        return proto;
    }

    public static Application.NtpSettings FromProto(this NtpSettings proto)
    {
        Application.NtpSettings settings = new();
        if (proto.PrimaryNtpServer != null) settings.PrimaryNtpServer = proto.PrimaryNtpServer;
        if (proto.SecondaryNtpServer != null) settings.SecondaryNtpServer = proto.SecondaryNtpServer;

        return settings;
    }

    public static TimeSettings ToProto(this Application.TimeSettings settings)
    {
        TimeSettings proto = new TimeSettings();
        proto.AppTimeZone = settings.TimeZone.ToProto();
        proto.NtpSettings = settings.NtpSettings.ToProto();
        return proto;
    }

    public static Application.TimeSettings FromProto(this TimeSettings proto)
    {
        Application.TimeSettings settings = new();
        settings.TimeZone = proto.AppTimeZone.FromProto();
        settings.NtpSettings = proto.NtpSettings.FromProto();
        return settings;
    }
}