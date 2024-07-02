using System.Text.RegularExpressions;

namespace Fibertest30.Infrastructure.Device;
internal class OxcProtocol
{
    public const char BeginMarker = '<';
    public const char EndMarker = '>';

    private static void throwInvalidResponse(string response)
    {
        throw new InvalidDataException($"Invalid OXC OTAU response: {response}");
    }

    public abstract class GetQuery<T>
    {
        private readonly string _name;
        private readonly int _address;
        private readonly OxcSocket _socket;

        protected GetQuery(OxcSocket socket, int address, string name)
        {
            _socket = socket;
            _address = address;
            _name = name;
        }

        public async Task<T> Perform(CancellationToken ct)
        {
            string request = Request();
            await _socket.Write(System.Text.Encoding.ASCII.GetBytes(request), ct);
            byte[] response = await _socket.ReadUntil((byte)OxcProtocol.EndMarker, ct);
            return ParseResponse(System.Text.Encoding.ASCII.GetString(response));
        }

        private string Request() => $"<AD{_address:D2}_{_name}_?>";

        private T ParseResponse(string response)
        {
            var match = Regex.Match(response, @$"^<AD(\d+)_{_name}_([a-zA-Z0-9-]+)>$");
            int parsedAddress;
            T? parsedValue = default(T);
            if (!match.Success ||
                !Int32.TryParse(match.Groups[1].Value, out parsedAddress) ||
                _address != parsedAddress ||
                !TryParseResponseValue(match.Groups[2].Value, out parsedValue))
            {
                throwInvalidResponse(response);
            }
            return parsedValue!;
        }

        protected abstract bool TryParseResponseValue(string value, out T parsed);
    }

    public class SetQuery<T>
    {
        private readonly int _address;
        private readonly string _name;
        private readonly OxcSocket _socket;

        protected SetQuery(OxcSocket socket, int address, string name)
        {
            _socket = socket;
            _address = address;
            _name = name;
        }

        public async Task Perform(T value, CancellationToken ct)
        {
            string request = Request(value);
            await _socket.Write(System.Text.Encoding.ASCII.GetBytes(request), ct);
            byte[] response = await _socket.ReadUntil((byte)OxcProtocol.EndMarker, ct);
            CheckResponse(System.Text.Encoding.ASCII.GetString(response));
        }

        private string Request(T value) => $"<AD{_address:D2}_{_name}_{ToRequestValueString(value)}>";

        protected virtual string ToRequestValueString(T value) => $"{value}";

        private void CheckResponse(string response)
        {
            var match = Regex.Match(response, @"^<AD(\d+)_OK>$");
            int parsedAddress;
            if (!match.Success ||
                !Int32.TryParse(match.Groups[1].Value, out parsedAddress) ||
                _address != parsedAddress)
            {
                throwInvalidResponse(response);
            }
        }
    }

    public class GetStringQuery : GetQuery<string>
    {
        public GetStringQuery(OxcSocket socket, int address, string name) 
            : base(socket, address, name) { }

        protected override bool TryParseResponseValue(string value, out string parsed)
        {
            parsed = value;
            return true;
        }
    }

    public class SetPortQuery : SetQuery<int>
    {
        public SetPortQuery(OxcSocket socket, int address) : base(socket, address, "S") { }

        protected override string ToRequestValueString(int port) => $"{port:D3}";
    }
    public SetPortQuery SetPort { get; init; }
    public class GetMaxPortsQuery : GetQuery<int>
    {
        public GetMaxPortsQuery(OxcSocket socket, int address) : base(socket, address, "MAX") { }

        protected override bool TryParseResponseValue(string value, out int parsedPortCount)
        {
            const int minPortCount = 1;
            const int maxPortCount = 1024;
            return Int32.TryParse(value, out parsedPortCount) &&
                parsedPortCount >= minPortCount && parsedPortCount <= maxPortCount;
        }
    }
    public GetMaxPortsQuery GetMaxPorts { get; init; }

    public class GetModelQuery : GetStringQuery
    {
        public GetModelQuery(OxcSocket socket, int address) : base(socket, address, "MOD") { }
    }
    public GetModelQuery GetModel { get; init; }

    public class GetSerialNumberQuery : GetStringQuery
    {
        public GetSerialNumberQuery(OxcSocket socket, int address) : base(socket, address, "SN") { }
    }
    public GetSerialNumberQuery GetSerialNumber { get; init; }

    public class GetVersionQuery : GetQuery<string>
    {
        public GetVersionQuery(OxcSocket socket, int address) : base(socket, address, "VER") { }

        protected override bool TryParseResponseValue(string value, out string parsed)
        {
            // As per doc 0130 means 1.30. Try to parse that, otherwise return as is.
            var match = Regex.Match(value, @"^(\d\d)(\d\d)$");
            parsed = match.Success ? $"{match.Groups[1].Value}.{match.Groups[2].Value}" : value;
            return true;
        }
    }
    public GetVersionQuery GetVersion { get; init; }

    public class ResetQuery
    {
        private readonly OxcSocket _socket;
        private readonly int _address;
        private readonly IDelayService _delayService;

        public ResetQuery(OxcSocket socket, int address, IDelayService delayService)
        {
            _socket = socket;
            _address = address;
            _delayService = delayService;
        }

        public async Task Perform(CancellationToken ct)
        {
            string request = Request();
            await _socket.Write(System.Text.Encoding.ASCII.GetBytes(request), ct);
            await _delayService.Delay(5000, ct);
        }

        private string Request() => $"<AD{_address:D2}_RESET>";

        // No response in reset command.
    }
    public ResetQuery Reset { get; init; }

    public OxcProtocol(OxcSocket socket, int address, IDelayService delayService)
    {
        SetPort = new SetPortQuery(socket, address);
        GetMaxPorts = new GetMaxPortsQuery(socket, address);
        GetModel = new GetModelQuery(socket, address);
        GetSerialNumber = new GetSerialNumberQuery(socket, address);
        GetVersion = new GetVersionQuery(socket, address);
        Reset = new ResetQuery(socket, address, delayService);
    }
}
