using System.Net;
using System.Net.Sockets;

namespace Fibertest30.Application;

public static class NetworkUtils
{
    public static string GetExternalIpAddress()
    {
        // https://stackoverflow.com/questions/6803073/get-local-ip-address
        // This method essentially "asks" the OS,
        // "If I were to send packets to this IP address, which local IP address would I use?" 
        
        using Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, 0);
        // There is no real connection established, hence the specified remote ip can be unreachable
        socket.Connect("8.8.8.8", 65530);
        var endPoint = socket.LocalEndPoint as IPEndPoint;
        return endPoint?.Address.ToString() ?? string.Empty;
    }
}

