using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure.Device;

// TODO: Seems like Discover is called three times during Otau addition:
//       from Web UI button + before create Otau + in init Otau
// TODO: Seems like Ping is called the first time just after the Otau is connected.
// TODO: During app shutdown by Ctrl+C: Error while pinging otau: System.ObjectDisposedException: Cannot access a disposed object.
// TODO: Seems like Otau.Ping is done in separate thread. Hence we probably need locks (or other protection from simultaneous access).
// TODO: Do we need to add retries the same way it's done in C++ app, especially for OSM.
// TODO: Seems like Disconnect is not called when removing OTAU (at least OXC) => we cannot re-add OXC OTAU after it was removed
//       (since there is unclosed TCP connection alteady with this OTAU).

public class OtauControllerFactory : IOtauControllerFactory
{
    private readonly ILogger<OtauControllerFactory> _logger;
    private readonly IDelayService _delayService;
    private readonly OcmSerialPort _ocmSerialPort;
    private readonly OsmSerialPort _osmSerialPort;

    public OtauControllerFactory(ILogger<OtauControllerFactory> logger, IDelayService delayService)
    {
        _logger = logger;
        _delayService = delayService;
        _ocmSerialPort = new OcmSerialPort(_logger);
        _osmSerialPort = new OsmSerialPort(_logger);
    }

    public IOtauController CreateOcm()
    {
        return new OcmController(_ocmSerialPort, _delayService, _logger);
    }

    public IOtauController CreateOsm(int chainAddress)
    {
        return new OsmController(_osmSerialPort, chainAddress, _delayService, _logger);
    }

    public IOtauController CreateOxc(string ip, int port)
    {
        OxcSocket socket = new(ip, port, _logger);
        return new OxcController(socket, _delayService, _logger);
    }
}