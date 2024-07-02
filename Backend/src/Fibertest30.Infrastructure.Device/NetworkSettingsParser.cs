namespace Fibertest30.Infrastructure.Device;

public static class NetworkSettingsParser
{
    public static NetworkSettings Parse(string output)
    {
        var lines = output.Split('\n');

        NetworkSettings networkSettings = new NetworkSettings()
        {
            NetworkMode = GetValue(lines, "Network Mode"),
            LocalIpAddress = GetValue(lines, "Local IP address"),
            LocalSubnetMask = GetValue(lines, "Local subnet mask"),
            LocalGatewayIp = GetValue(lines, "Local gateway IP"),
        };

        var dnsList = ParseDnsServers(lines);
        networkSettings.PrimaryDnsServer = dnsList.Count > 0 ? dnsList[0].Trim() : null;
        networkSettings.SecondaryDnsServer = dnsList.Count > 1 ? dnsList[1].Trim() : null;

        return networkSettings;
    }

    private static string? GetValue(string[] lines, string key)
    {
        var line = lines.FirstOrDefault(l => l.StartsWith(key));
        if (line == null) return null;
        var ss = line.Split(':');
        return ss[1].Trim();
    }

    private static List<string> ParseDnsServers(string[] lines)
    {
        var line = lines.FirstOrDefault(l => l.StartsWith("DNS "));
        if (line == null) return new List<string>();
        var ss = line.Split(':');
        var ddd = ss[1].Trim().Split(' ');
        return ddd.ToList();
    }
}