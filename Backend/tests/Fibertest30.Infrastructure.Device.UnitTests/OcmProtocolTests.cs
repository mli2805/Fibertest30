
using Fibertest30.Infrastructure.Device;

namespace Fibertest30.Application.UnitTests;

public class NoDelayService : IDelayService
{
    public void Sleep(int milliseconds) {}

    public Task Delay(int milliseconds) => Task.CompletedTask;

    public Task Delay(int milliseconds, CancellationToken ct) => Task.CompletedTask;
}

[TestClass]
public class OcmProtocolTests
{
    private class EmulatedPort : IOcmSerialPort
    {
        public MemoryStream InputStream { get; init; }
        public MemoryStream OutputStream { get; init; } = new MemoryStream();

        public EmulatedPort(byte[]? data = null)
        {
            InputStream = new MemoryStream(data ?? Array.Empty<byte>());
        }

        public static EmulatedPort WithInputData(byte[]? data = null)
        {
            return new EmulatedPort(data);
        }

        public Task WriteExactly(byte[] buffer)
        {
            return OutputStream.WriteAsync(buffer).AsTask();
        }

        public async Task ReadExactly(byte[] buffer, int offset, int count)
        {
            try
            {
                await InputStream.ReadExactlyAsync(buffer, offset, count);
            }
            catch (EndOfStreamException)
            {
                throw new TimeoutException();
            }
        }
    }

    private readonly IDelayService _delayService = new NoDelayService();

    private OcmProtocol CreateProtocol(IOcmSerialPort port)
    {
        return new OcmProtocol(port, _delayService);
    }

    public static IEnumerable<object[]> ProtocolCommands
    {
        get
        {
            return new[]
            {
                new object[] {(object p) => ((OcmProtocol)p).QueryChannel() },
                new object[] {(object p) => ((OcmProtocol)p).SetChannel(0) },
                new object[] {(object p) => ((OcmProtocol)p).QueryFirmwareVersion() },
                new object[] {(object p) => ((OcmProtocol)p).QueryHardwareVersion() },
                new object[] {(object p) => ((OcmProtocol)p).QueryManufacturerId() },
                new object[] {(object p) => ((OcmProtocol)p).QueryManufacturerName() },
                new object[] {(object p) => ((OcmProtocol)p).QueryProductionDate() },
                new object[] {(object p) => ((OcmProtocol)p).QuerySerialNumber() }
            };
        }
    }

    static byte[] GetWrittenBytes(EmulatedPort port)
    {
        return port.OutputStream.ToArray();
    }

    [TestMethod]
    public async Task SetChannelWritesCorrectBytes()
    {
        {
            var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x05, 0x00, 0x10, 0x00, 0x16 });
            var protocol = CreateProtocol(port);
            await protocol.SetChannel(0);
            GetWrittenBytes(port).Should().BeEquivalentTo(new byte[] { 0x55, 0x05, 0x00, 0x10, 0x00, 0x16 });
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x05, 0x00, 0x10, 0x00, 0x16 });
            var protocol = CreateProtocol(port);
            await protocol.SetChannel(7);
            GetWrittenBytes(port).Should().BeEquivalentTo(new byte[] { 0x55, 0x05, 0x00, 0x10, 0x07, 0x13 });
        }
    }

    [TestMethod]
    public async Task QueryChannelReturnsChannelAndWritesCorrectBytes()
    {
        byte[] expectedWrite = new byte[] { 0x55, 0x04, 0x00, 0x11, 0x16 };
        {
            var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x06, 0x00, 0x11, 0x00, 0x00, 0x18 });
            var protocol = CreateProtocol(port);
            int channel = await protocol.QueryChannel();
            channel.Should().Be(0);
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x06, 0x00, 0x11, 0x07, 0x00, 0x11 });
            var protocol = CreateProtocol(port);
            var channel = await protocol.QueryChannel();
            channel.Should().Be(7);
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x06, 0x00, 0x11, 0xFF, 0x00, 0xE9 });
            var protocol = CreateProtocol(port);
            var channel = await protocol.QueryChannel();
            channel.Should().Be(-1);
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
    }

    [TestMethod]
    public async Task QueryHardwareVersionReturnsHardwareVersionAndWritesCorrectBytes()
    {
        byte[] expectedWrite = new byte[] { 0x55, 0x04, 0x00, 0x05, 0x02 };
        { 
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x0C, 0x00, 0x05, 0x31, 0x2E, 0x30, 0x30, 0x54, 0x30, 0x30, 0x00, 0x43 });
            var protocol = CreateProtocol(port);
            string version = await protocol.QueryHardwareVersion();
            version.Should().Be("1.00T00");
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x0C, 0x00, 0x05, 0x31, 0x01, 0x00, 0x00, 0x20, 0xF0, 0x00, 0x00, 0xEA });
            var protocol = CreateProtocol(port);
            var version = await protocol.QueryHardwareVersion();
            version.Should().Be("1\x1\x0\x0 ?\x0");
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
    }

    [TestMethod]
    public async Task QueryFirmwareVersionReturnsFirmwareVersionAndWritesCorrectBytes()
    {
        byte[] expectedWrite = new byte[] { 0x55, 0x04, 0x00, 0x04, 0x01 };
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x0C, 0x00, 0x04, 0x31, 0x2E, 0x30, 0x36, 0x54, 0x30, 0x35, 0x00, 0x41 });
            var protocol = CreateProtocol(port);
            string version = await protocol.QueryFirmwareVersion();
            version.Should().Be("1.06T05");
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x0C, 0x00, 0x04, 0x31, 0x01, 0x00, 0x00, 0x20, 0xF0, 0x00, 0x00, 0xE9 });
            var protocol = CreateProtocol(port);
            var version = await protocol.QueryFirmwareVersion();
            version.Should().Be("1\x1\x0\x0 ?\x0");
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
    }

    [TestMethod]
    public async Task QueryQueryManufacturerIdReturnsQueryManufacturerIdAndWritesCorrectBytes()
    {
        byte[] expectedWrite = new byte[] { 0x55, 0x04, 0x00, 0x01, 0x06 };

        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x09, 0x00, 0x01, 0x30, 0x30, 0x30, 0x31, 0x00, 0x0A });
            var protocol = CreateProtocol(port);
            Tuple<ushort, ushort> id = await protocol.QueryManufacturerId();
            id.Should().Be(Tuple.Create<ushort, ushort>(0x3030, 0x3031));
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x09, 0x00, 0x01, 0x00, 0x01, 0x02, 0x03, 0x00, 0x09 });
            var protocol = CreateProtocol(port);
            var id = await protocol.QueryManufacturerId();
            id.Should().Be(Tuple.Create<ushort, ushort>(0x0001, 0x0203));
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
    }

    [TestMethod]
    public async Task QueryManufacturerNameReturnsManufacturerNameAndWritesCorrectBytes()
    {
        byte[] expectedWrite = new byte[] { 0x55, 0x04, 0x00, 0x02, 0x07 };
        {
            var port = EmulatedPort.WithInputData(new byte[] { 
                0x55, 0x15, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18 });
            var protocol = CreateProtocol(port);
            string name = await protocol.QueryManufacturerName();
            name.Should().Be("\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x15, 0x00, 0x02, 0x54, 0x73, 0x74, 0x20, 0x6D, 0x61, 0x6E, 
                0x75, 0x66, 0x61, 0x63, 0x74, 0x75, 0x72, 0x65, 0x72, 0x00, 0x74 });
            var protocol = CreateProtocol(port);
            var name = await protocol.QueryManufacturerName();
            name.Should().Be("Tst manufacturer");
            GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
        }
    }

    [TestMethod]
    public async Task QueryProductionDateReturnsProductionDateAndWritesCorrectBytes()
    {
        byte[] expectedWrite = new byte[] { 0x55, 0x04, 0x00, 0x06, 0x03 };

        var port = EmulatedPort.WithInputData(new byte[] { 
            0x55, 0x0F, 0x00, 0x06, 0x32, 0x30, 0x32, 0x32, 0x2D, 0x30, 0x39, 0x2D, 0x31, 0x34, 0x00, 0x08 });
        var protocol = CreateProtocol(port);
        string date = await protocol.QueryProductionDate();
        date.Should().Be("2022-09-14");
        GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
    }


    [TestMethod]
    public async Task QuerySerialNumberReturnsSerialNumberAndWritesCorrectBytes()
    {
        byte[] expectedWrite = new byte[] { 0x55, 0x04, 0x00, 0x03, 0x08 };

        var port = EmulatedPort.WithInputData(new byte[] {
            0x55, 0x10, 0x00, 0x03, 0x32, 0x32, 0x30, 0x39, 0x30, 0x34, 0x39, 0x30, 0x34, 0x39, 0x38, 0x00, 0x23 });
        var protocol = CreateProtocol(port);
        string serialNumber = await protocol.QuerySerialNumber();
        serialNumber.Should().Be("22090490498");
        GetWrittenBytes(port).Should().BeEquivalentTo(expectedWrite);
    }

    [TestMethod]
    [DynamicData(nameof(ProtocolCommands))]
    public async Task QueryOnEmptyPortThrowsTimeoutException(Func<object, Task> protocolCaller)
    {
        var port = EmulatedPort.WithInputData();
        var protocol = CreateProtocol(port);
        Func<Task> query = async () => await protocolCaller(protocol);
        await query.Should().ThrowAsync<TimeoutException>();
    }

    [TestMethod]
    [DynamicData(nameof(ProtocolCommands))]
    public async Task QueryOnBadDataWithoutMarkerThrowsTimeoutException(Func<object, Task> protocolCaller)
    {
        var port = EmulatedPort.WithInputData(new byte[] {
            0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xA, 0xB, 0xC, 0xE, 0xF});
        var protocol = CreateProtocol(port);
        Func<Task> query = async () => await protocolCaller(protocol);
        await query.Should().ThrowAsync<TimeoutException>();
    }

    [TestMethod]
    [DynamicData(nameof(ProtocolCommands))]
    public async Task QueryOnMissingPayloadThrowsTimeoutException(Func<object, Task> protocolCaller)
    {
        var port = EmulatedPort.WithInputData(new byte[] { 0x55 });
        var protocol = CreateProtocol(port);
        Func<Task> query = async () => await protocolCaller(protocol);
        await query.Should().ThrowAsync<TimeoutException>();
    }

    [TestMethod]
    [DynamicData(nameof(ProtocolCommands))]
    public async Task QueryOnPayloadLengthTooSmallThrowsInvalidDataException(Func<object, Task> protocolCaller)
    {
        {
            var port = EmulatedPort.WithInputData(new byte[] {
            0x55, 0x00, 0x00, 0x10, 0x00, 0x00 });
            var protocol = CreateProtocol(port);
            Func<Task> query = async () => await protocolCaller(protocol);
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x01, 0x00, 0x10, 0x00, 0x00 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocolCaller(protocol);
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x02, 0x00, 0x10, 0x00, 0x00 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocolCaller(protocol);
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x03, 0x00, 0x10, 0x00, 0x00 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocolCaller(protocol);
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x04, 0x00, 0x10, 0x00, 0x00 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocolCaller(protocol);
            await query.Should().ThrowAsync<InvalidDataException>();
        }
    }

    [TestMethod]
    public async Task QueryOnPayloadLengthLessThanExpectedThrowsInvalidDataException()
    {
        {
            var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x05, 0x00, 0x11, 0x00, 0x15 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryChannel();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x0B, 0x00, 0x05, 0x31, 0x2E, 0x30, 0x30, 0x54, 0x30, 0x00, 0x76 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryHardwareVersion();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x0B, 0x00, 0x04, 0x31, 0x2E, 0x30, 0x36, 0x54, 0x30, 0x00, 0x73 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryFirmwareVersion();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x08, 0x00, 0x01, 0x30, 0x30, 0x30, 0x00, 0x3A });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryManufacturerId();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x14, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x17 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryManufacturerName();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            byte[] expectedWrite = new byte[] { 0x55, 0x04, 0x00, 0x06, 0x03 };

            var port = EmulatedPort.WithInputData(new byte[] {
            0x55, 0x0E, 0x00, 0x06, 0x32, 0x30, 0x32, 0x32, 0x2D, 0x30, 0x39, 0x2D, 0x31, 0x00, 0x33 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryProductionDate();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            byte[] expectedWrite = new byte[] { 0x55, 0x04, 0x00, 0x03, 0x08 };

            var port = EmulatedPort.WithInputData(new byte[] {
            0x55, 0x0F, 0x00, 0x03, 0x32, 0x32, 0x30, 0x39, 0x30, 0x34, 0x39, 0x30, 0x34, 0x39, 0x00, 0x06 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QuerySerialNumber();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
    }

    [TestMethod]
    public async Task QueryOnPayloadLengthGreaterThanExpectedThrowsInvalidDataException()
    {
        {
            var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x06, 0x00, 0x10, 0x00, 0x00, 0x17 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.SetChannel(0);
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x07, 0x00, 0x11, 0x00, 0x00, 0x00, 0x17 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryChannel();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x0D, 0x00, 0x05, 0x31, 0x2E, 0x30, 0x30, 0x54, 0x30, 0x30, 0x00, 0x00, 0x44 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryHardwareVersion();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x0D, 0x00, 0x04, 0x31, 0x2E, 0x30, 0x36, 0x54, 0x30, 0x35, 0x00, 0x00, 0x42 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryFirmwareVersion();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x0A, 0x00, 0x01, 0x30, 0x30, 0x30, 0x31, 0x00, 0x00, 0x0A });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryManufacturerId();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x16, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x15 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryManufacturerName();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x10, 0x00, 0x06, 0x00, 0x32, 0x30, 0x32, 0x32, 0x2D, 0x30, 0x39, 0x2D, 0x31, 0x34, 0x00, 0x19 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QueryProductionDate();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
        {
            var port = EmulatedPort.WithInputData(new byte[] {
                0x55, 0x11, 0x00, 0x03, 0x00, 0x32, 0x32, 0x30, 0x39, 0x30, 0x34, 0x39, 0x30, 0x34, 0x39, 0x38, 0x00, 0x24 });
            var protocol = CreateProtocol(port);
            var query = async () => await protocol.QuerySerialNumber();
            await query.Should().ThrowAsync<InvalidDataException>();
        }
    }

    [TestMethod]
    public async Task QueryWithInvalidChecksumThrowsInvalidDataException()
    {
        var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x05, 0x00, 0x10, 0x00, 0x17 });
        var protocol = CreateProtocol(port);
        var query = async () => await protocol.SetChannel(0);
        await query.Should().ThrowAsync<InvalidDataException>();
    }

    [TestMethod]
    public async Task QueryWithUnexpectedCommandInResponseThrowsInvalidDataException()
    {
        var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x05, 0x00, 0x11, 0x00, 0x15 });
        var protocol = CreateProtocol(port);
        var query = async () => await protocol.SetChannel(0);
        await query.Should().ThrowAsync<InvalidDataException>();
    }

    [TestMethod]
    public async Task QueryWithNonZeroStatusInResponseThrowsInvalidDataException()
    {
        var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x05, 0x00, 0x10, 0x04, 0x12 });
        var protocol = CreateProtocol(port);
        var query = async () => await protocol.SetChannel(0);
        await query.Should().ThrowAsync<Exception>();
    }

    [TestMethod]
    public async Task QueryWithCommandParameterErrorStatusInResponseThrowsArgumentException()
    {
        var port = EmulatedPort.WithInputData(new byte[] { 0x55, 0x05, 0x00, 0x10, 0x03, 0x17 });
        var protocol = CreateProtocol(port);
        var query = async () => await protocol.SetChannel(0);
        await query.Should().ThrowAsync<ArgumentException>();
    }
}
