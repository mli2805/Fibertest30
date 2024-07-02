using System.Buffers.Binary;

namespace Fibertest30.Infrastructure.Device;

/// <summary>
/// Class implements the protocol of the embedded OCM OTAU, which uses M1 or M2 OTAU manufactured by HC.
/// Please note, that in contradiction to the HC M1/M2 switches documentation, the embedded OCM switch
/// does NOT use the so called 55h-encoding (escaping of byte 55h in the packet payload). According 
/// to Yanjun this was confirmed by HC.
/// For the reference C++ implementation, please see http://192.168.96.2/svn/OptixSoft-OTDR-CE_Repos/CeRtu/trunk/src/Core/core.lib/devices/otau/m1protocol.h
/// </summary>
public partial class OcmProtocol
{
    private const byte Marker = 0x55;
    private readonly IDelayService _delayService;
    private readonly IOcmSerialPort _serialPort;

    private Task ReadByte(byte[] buffer)
    {
        return _serialPort.ReadExactly(buffer, 0, 1);
    }

    private async Task ReadUntilPayload()
    {
        var buffer = new byte[1];
        do
        {
            await ReadByte(buffer);
        } while (buffer[0] != Marker);
    }

    private async Task<byte[]> PerformQuery(
        CommandPayload command, int expectedResponseValueLength)
    {
        byte[] output = new byte[1 + command.Bytes.Length];
        output[0] = Marker;
        command.Bytes.CopyTo(output, 1);
        await _serialPort.WriteExactly(output);

        await _delayService.Delay(100);

        await ReadUntilPayload();

        var buffer = new byte[1];
        await ReadByte(buffer);
        int payloadLength = buffer[0];

        if (payloadLength < 1)
            throw new InvalidDataException($"Invalid payload length: {payloadLength}");

        payloadLength -= 1; // Payload length counts the byte length, which we have already read
        buffer = new byte[payloadLength];
        await _serialPort.ReadExactly(buffer, 0, payloadLength);
        var response = new ResponsePayload(buffer);

        Validate(response, command, expectedResponseValueLength);

        return response.Value;
    }

    private static void Validate(ResponsePayload response, CommandPayload command, int expectedResponseValueLength)
    {
        if (response.Checksum != response.ExpectedChecksum)
        {
            throw new InvalidDataException(
                $"Invalid response payload checksum 0x{response.Checksum:X2}," +
                $" expected 0x{response.ExpectedChecksum:X2}");
        }

        if (response.Status != 0)
        {
            ThrowStatusException(response.Status);
        }

        if (response.Command != command.Command)
        {
            throw new InvalidDataException(
                $"Invalid response command code 0x{response.Command:X4}," +
                $" expected 0x{command.Command:X4}");
        }

        if (expectedResponseValueLength != response.Value.Length)
        {
            // At least on the prototype RFTS-400 in Taiwan the built-in OCM switch
            // had serial number of 11 bytes instead of 8 bytes as in documentation.
            throw new InvalidDataException(
                $"Invalid response payload value length {response.Value.Length}," +
                $" expected {expectedResponseValueLength}");
        }
    }

    private static void ThrowStatusException(int status)
    {
        if (status == 0)
            return;
        String s = $"Non-zero response status code: {status:X} - ";
        switch (status)
        {
        case 0x1: throw new System.Exception(s + "frame format error");
        case 0x2: throw new System.Exception(s + "checksum error");
        case 0x3: throw new ArgumentException(s + "command parameter error");
        case 0x5: throw new System.Exception(s + "execution timeout");
        case 0x4: throw new System.Exception(s + "execution failed");
        case 0x6: throw new System.Exception(s + "module is not ready");
        case 0x7: throw new System.Exception(s + "command error");
        case 0x8: throw new System.Exception(s + "device without calibration data");
        }
    }

    public OcmProtocol(IOcmSerialPort serialPort, IDelayService delayService)
    {
        _delayService = delayService;
        _serialPort = serialPort;
    }

    public async Task<Tuple<UInt16, UInt16>> QueryManufacturerId()
    {
        const UInt16 code = 0x1;
        byte[] requestData = Array.Empty<byte>();
        const int expectedResponseValueSize = 4;

        var command = new CommandPayload(code, requestData);
        byte[] data = await PerformQuery(command, expectedResponseValueSize);

        return Tuple.Create(
            BinaryPrimitives.ReadUInt16BigEndian(data.AsSpan(0, 2)),
            BinaryPrimitives.ReadUInt16BigEndian(data.AsSpan(2, 2)));
    }

    public async Task<string> QueryManufacturerName()
    {
        const UInt16 code = 0x2;
        byte[] requestData = Array.Empty<byte>();
        const int expectedResponseValueSize = 16;

        var command = new CommandPayload(code, requestData);
        byte[] data = await PerformQuery(command, expectedResponseValueSize);

        return System.Text.Encoding.ASCII.GetString(data);
    }

    public async Task<string> QuerySerialNumber()
    {
        const UInt16 code = 0x3;
        byte[] requestData = Array.Empty<byte>();
        const int expectedResponseValueSize = 11; // though 8 in the documentation

        var command = new CommandPayload(code, requestData);
        byte[] data = await PerformQuery(command, expectedResponseValueSize);

        return System.Text.Encoding.ASCII.GetString(data);
    }

    public async Task<string> QueryFirmwareVersion()
    {
        const UInt16 code = 0x4;
        byte[] requestData = Array.Empty<byte>();
        const int expectedResponseValueSize = 7;

        var command = new CommandPayload(code, requestData);
        byte[] data = await PerformQuery(command, expectedResponseValueSize);

        return System.Text.Encoding.ASCII.GetString(data);
    }

    public async Task<string> QueryHardwareVersion()
    {
        const UInt16 code = 0x5;
        byte[] requestData = Array.Empty<byte>();
        const int expectedResponseValueSize = 7;

        var command = new CommandPayload(code, requestData);
        byte[] data = await PerformQuery(command, expectedResponseValueSize);

        return System.Text.Encoding.ASCII.GetString(data);
    }

    public async Task<string> QueryProductionDate()
    {
        const UInt16 code = 0x6;
        byte[] requestData = Array.Empty<byte>();
        const int expectedResponseValueSize = 10;

        var command = new CommandPayload(code, requestData);
        byte[] data = await PerformQuery(command, expectedResponseValueSize);

        return System.Text.Encoding.ASCII.GetString(data);
    }

    public async Task SetChannel(int channel)
    {
        // In protocol 0-based indices are used, 0xFF is 'dark' channel.
        const UInt16 code = 0x10;
        var requestData = new byte[] { (channel == -1) ? (byte)0xFF : byte.CreateChecked(channel) };
        const int expectedResponseValueSize = 0;

        var command = new CommandPayload(code, requestData);
        await PerformQuery(command, expectedResponseValueSize);
    }

    public async Task<int> QueryChannel()
    {
        const UInt16 code = 0x11;
        byte[] requestData = Array.Empty<byte>();
        const int expectedResponseValueSize = 1;

        var command = new CommandPayload(code, requestData);
        byte[] data = await PerformQuery(command, expectedResponseValueSize);

        return (data[0] == 0xFF) ? -1 : data[0];
    }
}