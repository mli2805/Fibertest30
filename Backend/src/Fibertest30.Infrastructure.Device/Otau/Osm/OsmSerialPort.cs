using Microsoft.Extensions.Logging;
using System.IO.Ports;

namespace Fibertest30.Infrastructure.Device;

internal class OsmSerialPort
{
    private readonly ILogger _logger;
    private readonly SerialPort _serialPort = new();

    private void ConfigurePort()
    {
        _serialPort.PortName = "/dev/ttymxc0";
        _serialPort.BaudRate = 115200;
        _serialPort.DataBits = 8;
        _serialPort.StopBits = StopBits.One;
        _serialPort.Parity = Parity.None;
        _serialPort.Handshake = Handshake.None;
        _serialPort.ReadTimeout = 2000;
        _serialPort.WriteTimeout = 2000;
    }

    public OsmSerialPort(ILogger logger)
    {
        _logger = logger;

        _logger.LogTrace("Opening OSM OTAU serial port...");
        ConfigurePort();
        _serialPort.Open();
    }

    public async Task WriteExactly(byte[] buffer, int offset, int count)
    {
        await _serialPort.BaseStream.WriteAsync(buffer, offset, count);
        _logger.LogTrace($"Wrote to OSM OTAU serial port: {ToPrintableAscii(buffer, offset, count)}");
    }

    public async Task<byte[]> ReadUntilBytesOrTimeout(byte[]? expectedEndingBytes=null)
    {
        List<byte> result = new();

        while (true)
        {
            int b = await ReadByte();
            if (b < 0)
                break;
            result.Add((byte)b);

            if (EndsWith(result, expectedEndingBytes))
                break;
        }

        return result.ToArray();
    }

    private Task<int> ReadByte()
    {
        // NOTE: SerialPortStream does not support timeouts within async methods, so we wrap the sync methods into Task.Run().
        return Task.Run(() =>
        {
            try
            {
                int b = _serialPort.ReadByte(); // TODO: ct ignored!
                if (b == -1)
                {
                    throw new InvalidDataException("Unexpected end of stream while reading from OSM OTAU serial port");
                }
                _logger.LogTrace($"Read from OSM OTAU serial port: {ToPrintableAscii((byte)b)}");
                return b;
            }
            catch (TimeoutException) { return -1; }
        });
    }

    private static bool EndsWith(List<byte> what, byte[]? sequence)
    {
        if (what == null || sequence == null || what.Count < sequence.Length)
            return false;

        for (int i = 0; i < sequence.Length; i++)
        {
            if (!what[what.Count - sequence.Length + i].Equals(sequence[i]))
                return false;
        }

        return true;
    }

    private string ToPrintableAscii(byte b)
    {
        return ToPrintableAscii((char)b);
    }

    private string ToPrintableAscii(char b)
    {
        return (b >= '!' && b <= '~') ? $"{b}" : $@"\x{(int)b:X}";
    }

    private string ToPrintableAscii(byte[] bytes, int  offset, int count)
    {
        var chunks = bytes.Skip(offset).Take(count).Select(b => ToPrintableAscii(b));
        return string.Concat(chunks);
    }
}
