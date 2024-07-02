using Microsoft.Extensions.Logging;
using System.IO.Ports;

namespace Fibertest30.Infrastructure.Device;

public class OcmSerialPort : IOcmSerialPort
{
    private readonly ILogger _logger;
    private readonly SerialPort _serialPort = new();

    private void ConfigurePort()
    {
        _serialPort.PortName = "/dev/ttymxc2";
        _serialPort.BaudRate = 115200;
        _serialPort.DataBits = 8;
        _serialPort.StopBits = StopBits.One;
        _serialPort.Parity = Parity.None;
        _serialPort.Handshake = Handshake.None;
        _serialPort.ReadTimeout = 5000;
        _serialPort.WriteTimeout = 5000;
    }

    public OcmSerialPort(ILogger logger)
    {
        _logger = logger;

        _logger.LogDebug("Opening OCM OTAU serial port...");
        ConfigurePort();
        _serialPort.Open();
    }

    public Task ReadExactly(byte[] buffer, int offset, int count)
    {
        // NOTE: The SerialPort async read methods do not respect read timeout and block
        //       forever if there is no data available.
        return Task.Run(() =>
        {
            _serialPort.BaseStream.ReadExactly(buffer, offset, count);
            _logger.LogDebug($"Read from OCM OTAU serial port: 0x{Convert.ToHexString(buffer, offset, count)}");
        });
    }

    public async Task WriteExactly(byte[] buffer)
    {
        await _serialPort.BaseStream.WriteAsync(buffer);
        _logger.LogDebug($"Wrote to OCM OTAU serial port: 0x{Convert.ToHexString(buffer)}");
    }
}
