using System.Net;
using System.Reflection;

namespace Fibertest30.Application;

public record ServerInfo(string Title, string Address, string Version);

public static class ServerInfoProvider
{
    public static ServerInfo Get()
    {
        var version = Assembly.GetExecutingAssembly()
            .GetName()
            .Version?.ToString() ?? "";

        var hostName = Dns.GetHostName();
        var addresses = Dns.GetHostAddresses(hostName);

        string? address = null;

        foreach (var ip in addresses)
        {
            Console.WriteLine(ip.ToString());
            if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork) // IPv4
            {
                address = ip.ToString();
            }
        }

        return new ServerInfo("", address ?? "", version);
    }
}