using System.Buffers.Binary;

namespace Fibertest30.Infrastructure.Device;

public partial class OcmProtocol
{
    private class Payload
    {
        public byte Length { get; private init; }

        public UInt16 Command { get; private init; }

        public byte[] Value { get; private init; }

        protected byte? Status { get; private init; }

        public byte Checksum { get; private init; }

        public byte[] Bytes { get; private init; }

        public byte ExpectedChecksum { get; private init; }

        protected Payload(UInt16 command, byte[] value)
        {
            int neededLength = CalculateNeededLength(value.Length, withStatus: false, withLength: true);
            if (neededLength > byte.MaxValue)
                throw new ArgumentException("value is too large");

            Length = (byte)neededLength;
            Command = command;
            Value = value;

            var bytesWithoutChecksum = ToBytes().AsSpan(Range.EndAt(^1));
            ExpectedChecksum = CalculateChecksum(bytesWithoutChecksum);

            Checksum = ExpectedChecksum;
            Bytes = ToBytes();
        }

        /// <summary>
        /// Won't do checksum validation and any other validation except length.
        /// </summary>
        /// <param name="bytes">Should be w/o length, i.e. starting with two command bytes </param>
        protected Payload(Span<byte> bytes)
        {
            int minLength = CalculateNeededLength(valueLength: 0, withStatus: true, withLength: false);
            if (bytes.Length < minLength)
                throw new InvalidDataException($"payload data is too small: [{bytes.Length}] 0x{Convert.ToHexString(bytes)}");

            if (bytes.Length > byte.MaxValue)
                throw new InvalidDataException("payload data is too large");

            Length = (byte)(bytes.Length + 1);
            Command = BinaryPrimitives.ReadUInt16BigEndian(bytes.Slice(0, 2));
            Value = bytes.Slice(2, bytes.Length - 2 - 2).ToArray();
            Status = bytes[^2];
            Checksum = bytes[^1];
            Bytes = ToBytes();

            var bytesWithoutChecksum = Bytes.AsSpan(Range.EndAt(^1));
            ExpectedChecksum = CalculateChecksum(bytesWithoutChecksum);
        }

        private static int CalculateNeededLength(int valueLength, bool withStatus, bool withLength)
        {
            int LengthLength = withLength ? sizeof(byte) : 0;
            const int CommandLength = sizeof(UInt16);
            int StatusLength = withStatus ? sizeof(byte) : 0;
            const int ChecksumLength = sizeof(byte);
            return LengthLength + CommandLength + StatusLength + valueLength + ChecksumLength;
        }

        private static byte CalculateChecksum(Span<byte> bytes)
        {
            byte checksum = 0;
            foreach (var b in bytes)
            {
                checksum ^= b;
            }
            checksum += 1;
            return checksum;
        }

        private byte[] ToBytes()
        {
            var bytes = new byte[Length];
            bytes[0] = Length;
            BinaryPrimitives.WriteUInt16BigEndian(bytes.AsSpan(1, 2), Command);
            Value.CopyTo(bytes, 3);
            if (Status.HasValue)
                bytes[^2] = Status.Value;
            bytes[^1] = Checksum;
            return bytes;
        }
    }
    private class CommandPayload : Payload
    {
        public CommandPayload(UInt16 command, byte[] value)
            : base(command, value)
        {
        }
    }

    private class ResponsePayload : Payload
    {
        public ResponsePayload(Span<byte> bytes)
            : base(bytes)
        {
        }

        public new byte Status { get { return base.Status!.Value; } }
    }
}