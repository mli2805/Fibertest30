using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure.Device;
internal class OsmControllerProtocol
{
    private readonly ILogger _logger;
    private readonly OsmSerialPort _serialPort;
    private readonly IDelayService _delayService;

    public OsmControllerProtocol(OsmSerialPort serialPort, IDelayService delayService, ILogger logger)
    {
        _logger = logger;
        _serialPort = serialPort;
        _delayService = delayService;
    }

    public async Task SelectSwitch(int address)
    {
        string request = $"osm_addr {address}";

        const string expectedResponse = "M3_Okay";
        string response = await Communicate(request, expectedResponse);

        if (response != expectedResponse)
        {
            throw new InvalidDataException(
                $"Unexpected response for \"{request}\"." +
                $" Expected \"{expectedResponse}\", but got \"{response}\".");
        }
    }

    public async Task<string> GetFirmwareVersion()
    {
        return await Communicate("osm_FW");
    }

    public async Task<string> PerformCommand(string command)
    {
        string request = $"osm_cmd {command}";
        string expectedEndingString = $"{M3Protocol.EndMarker}";

        return await Communicate(request, expectedEndingString);
    }

    private async Task<string> Communicate(string request, string? expectedEndingString=null)
    {
        // Add leading and trailing '\n'. As per Zhenlei, OSM controller will 
        // execute the received command only after it receives '\n'.
        // The leading '\n' is sent to clear the OSM receiver FIFO. Probably not
        // necessary, but was added when trying to fix sporadic OSM communication problems.
        request = $"\n{request}\n";

        byte[] requestBytes = System.Text.Encoding.ASCII.GetBytes(request);

        await Write(requestBytes, 0, requestBytes.Length);

        await _delayService.Delay(10);

        byte[]? expectedEndingBytes = expectedEndingString != null ? 
            System.Text.Encoding.ASCII.GetBytes(expectedEndingString) : null;

        byte[] responseBytes = await ReadUntilTimeout(expectedEndingBytes);

        // For some reason OSM response may contain some garbage bytes before or after actual payload.
        // The filtering below is based on the Zhenlei's example code in rfts_400_osm.c, optical_switch_mode_check().
        responseBytes = Array.FindAll(responseBytes, c => c > ' ' && c <= '~');

        return System.Text.Encoding.ASCII.GetString(responseBytes);
    }

    private async Task<byte[]> ReadUntilTimeout(byte[]? expectedEndingBytes)
    {
        byte [] bytes = await _serialPort.ReadUntilBytesOrTimeout(expectedEndingBytes);
        _logger.LogDebug($"Read total from OSM OTAU serial port: {ToPrintableAscii(bytes)}");
        return bytes;
    }

    private async Task Write(byte[] buffer, int offset, int length)
    {
        // NOTE: When trying to fix sporadic OSM communication problems, we changed
        //       writing the whole command at once within a single write, to writing
        //       it by one byte with a delays between each byte. As per Zhenlei
        //       the OSM receiver FIFO is only 8 bytes, so we try hard to not
        //       overflow it.

        int written = 0;
        try
        {
            for (int i = 0; i < length; ++i)
            {
                bool justWroteLeadingNewLine = (i == 1) && (buffer[offset] == '\n');
                bool aboutToWriteTrailingNewLine = (i == length - 1) && (buffer[i] == '\n');
                bool needBiggerDelay = justWroteLeadingNewLine || aboutToWriteTrailingNewLine;

                await _delayService.Delay(needBiggerDelay ? 10 : 1);

                await _serialPort.WriteExactly(buffer, i, 1);
                written = i + 1;
            }
        }
        finally
        {
            _logger.LogDebug($"Wrote total to OSM OTAU serial port: {ToPrintableAscii(buffer, 0, written)}");
        }
    }

    private string ToPrintableAscii(byte b)
    {
        return ToPrintableAscii((char)b);
    }

    private string ToPrintableAscii(char b)
    {
        return (b >= '!' && b <= '~') ? $"{b}" : $@"\x{(int)b:X}";
    }

    private string ToPrintableAscii(byte[] bytes, int offset, int count)
    {
        var chunks = bytes.Skip(offset).Take(count).Select(ToPrintableAscii);
        return string.Concat(chunks);
    }

    private string ToPrintableAscii(byte[] bytes)
    {
        return ToPrintableAscii(bytes, 0, bytes.Length);
    }
}
