
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure.Device;
internal class OxcController : IOtauController
{
    private readonly ILogger _logger;
    private readonly OxcSocket _socket;
    private readonly OxcProtocol _protocol;
    private bool _isConnected;

    public OxcController(OxcSocket socket, IDelayService delayService, ILogger logger)
    {
        const int expectedChainAddress = 1;
        _logger = logger;
        _socket = socket;
        _protocol = new OxcProtocol(socket, expectedChainAddress, delayService);
        _isConnected = false;
    }

    public OtauType OtauType => OtauType.Oxc;

    public Task<bool> Blink(CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> Connect(CancellationToken ct)
    {
        try
        {
            bool success = await Ping(ct);
            _isConnected = success;
            return _isConnected;
        }
        finally
        {
            CloseSocketIfNotConnected();
        }
    }

    public Task Disconnect(CancellationToken ct)
    {
        _isConnected = false;

        _socket.Close();

        return Task.CompletedTask;
    }

    public async Task<OtauDiscover?> Discover(CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"Discovering OXC OTAU on {_socket.Address}...");

            ct.ThrowIfCancellationRequested();
            string model = await _protocol.GetModel.Perform(ct);
            _logger.LogDebug($"OXC OTAU model: {model}");

            ct.ThrowIfCancellationRequested();
            string version = await _protocol.GetVersion.Perform(ct);
            _logger.LogDebug($"OXC OTAU version: {version}");

            ct.ThrowIfCancellationRequested();
            string serialNumber = await _protocol.GetSerialNumber.Perform(ct);
            _logger.LogDebug($"OXC OTAU serial number: {serialNumber}");

            ct.ThrowIfCancellationRequested();
            int portCount = await _protocol.GetMaxPorts.Perform(ct);
            _logger.LogDebug($"OXC OTAU port count: {portCount}");

            return new OtauDiscover
            {
                SerialNumber = serialNumber,
                PortCount = portCount
            };
        }
        catch (Exception ex) when ((ex is not OperationCanceledException) || (!ct.IsCancellationRequested))
        {
            _logger.LogDebug($"Exception while discovering OXC OTAU on {_socket.Address}: {ex}");
            return null;
        }
        finally
        {
            CloseSocketIfNotConnected();
        }
    }

    public async Task<bool> Ping(CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"Pinging OXC OTAU on {_socket.Address}...");

            await _protocol.GetMaxPorts.Perform(ct);

            return true;
        }
        catch (Exception ex) when ((ex is not OperationCanceledException) || (!ct.IsCancellationRequested))
        {
            _logger.LogDebug($"Exception while pinging OXC OTAU: {ex}");
            return false;
        }
        finally
        {
            CloseSocketIfNotConnected();
        }
    }

    public async Task SetPort(int port, CancellationToken ct)
    {
        try
        {
            _logger.LogDebug($"Setting port of OXC OTAU on {_socket.Address} to {port}...");
            await _protocol.SetPort.Perform(port, ct);
        }
        finally
        {
            CloseSocketIfNotConnected();
        }
    }

    private void CloseSocketIfNotConnected()
    {
        // We retain socket connection only in Connected state. Otherwise we close the socket
        // to avoid multiple connections to the same Otau, which is not supported by OXC.
        if (!_isConnected)
        {
            _socket.Close();
        }
    }
}
