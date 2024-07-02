namespace Fibertest30.Infrastructure.Device;

public static class SystemSettingsCommandFactory
{
    public static string GetIpSettings()
    {
        return "rfts400config";
    }

    public static string UpdateIpSettings(string mode, string ipAddress, string subnetMask, string gatewayIp, bool untilReboot)
    {
        var system = untilReboot ? " -system" : ""; 
        return $"rfts400config {mode} -l {ipAddress} {subnetMask} {gatewayIp}{system}";
    }

    public static string UpdateDnsServers(string mode, string? primaryServer, string? secondaryServer)
    {
        if (string.IsNullOrEmpty(primaryServer) && string.IsNullOrEmpty(secondaryServer))
        {
            return $"rfts400config {mode} -dns 0";
        }

        if (!string.IsNullOrEmpty(primaryServer) && string.IsNullOrEmpty(secondaryServer))
        {
            return $"rfts400config {mode} -dns 1 {primaryServer}";
        }

        return $"rfts400config {mode} -dns 2 {primaryServer} {secondaryServer}";
    }

    public static string EnableDns(string mode)
    {
        return $"rfts400config {mode} -dnsctl 1";
    }

    public static string GetNtpServers()
    {
        return "ntpserver.sh status";
    }

    public static string AddNtpServer(string server)
    {
        return $"ntpserver.sh add {server}";
    }

    public static string DelNtpServer(string server)
    {
        return $"ntpserver.sh del {server}";
    }

    public static string SetTimezone(string ianaId)
    {
        return $"ln -sf /usr/share/zoneinfo/{ianaId}  /etc/localtime && echo \"{ianaId}\" > /etc/timezone";
    }
}
