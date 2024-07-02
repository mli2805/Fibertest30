using Microsoft.Extensions.Logging;
using System.Net.Sockets;

namespace Fibertest30.Infrastructure.Device;

internal class OxcSocket
{
    private readonly ILogger _logger;
    private readonly string _ip;
    private readonly int _port;
    private TcpClient? _tcpClient;

    private const int ConnectionTimeout = 1000;
    private const int ReceiveTimeout = 5000;
    private const int SendTimeout = 5000;

    public string Address => $"{_ip}:{_port}";

    public OxcSocket(string ip, int port, ILogger logger)
    {
        _logger = logger;
        _ip = ip;
        _port = port;
    }

    public async Task Write(byte[] bytes, CancellationToken ct)
    {
        await ConnectIfNeeded(ct);

        try
        {
            ct.ThrowIfCancellationRequested();
            await _tcpClient!.GetStream().WriteAsync(bytes, ct);
            ct.ThrowIfCancellationRequested();
            _logger.LogDebug($"Wrote to OXC OTAU at {Address}: {ToPrintableAscii(bytes)}");
        }
        catch (Exception)
        {
            Close();
            throw;
        }
    }

    public async Task<byte[]> ReadUntil(byte marker, CancellationToken ct)
    {
        await ConnectIfNeeded(ct);

        List<byte> received = new();
        do
        {
            received.Add(await ReadByte(ct));
        } while (received.Last() != marker);

        return received.ToArray();
    }

    public void Close()
    {
        if (_tcpClient != null)
        {
            _tcpClient.Close();
            _tcpClient = null;
            _logger.LogDebug($"Disconnected from OXC OTAU at {Address}");
        }
    }

    private async Task ConnectIfNeeded(CancellationToken ct)
    {
        if (_tcpClient == null)
        {
            _tcpClient = new ();
        }
        if (_tcpClient.Connected)
        {
            return;
        }
        _logger.LogDebug($"Connecting to OXC OTAU at {Address}...");
        ValueTask connectionTask = _tcpClient.ConnectAsync(_ip, _port, ct);
        try
        {
            await connectionTask.AsTask().WaitAsync(TimeSpan.FromMilliseconds(ConnectionTimeout), ct);
            ct.ThrowIfCancellationRequested();
        }
        catch (Exception)
        {
            Close();
            throw;
        }
        _tcpClient.ReceiveTimeout = ReceiveTimeout;
        _tcpClient.SendTimeout = SendTimeout;
        _logger.LogDebug($"Connected to OXC OTAU at {Address}");
    }

    private async Task<byte> ReadByte(CancellationToken ct)
    {
        var buffer = new byte[1];
        try
        {
            ct.ThrowIfCancellationRequested();
            // NOTE: ReadAsync does not respect ReadTimeout, so we use the the WaitAsync()
            //       call below and close the socket in case of any exception, including timeout.
            int receiveTimeout = _tcpClient!.ReceiveTimeout;
            ValueTask<int> readTask = _tcpClient!.GetStream().ReadAsync(buffer, ct);
            int res = (receiveTimeout == 0) ? 
                await readTask : 
                await readTask.AsTask().WaitAsync(TimeSpan.FromMilliseconds(receiveTimeout));
            ct.ThrowIfCancellationRequested();
            if (res == 1)
            {
                _logger.LogDebug($"Read from OXC OTAU at {Address}: {ToPrintableAscii(buffer[0])}");
                return buffer[0];
            }
            throw new IOException("Unexpected EOF from OXC OTAU");
        }
        catch (Exception)
        {
            Close();
            throw;
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

    private string ToPrintableAscii(byte[] bytes)
    {
        var chunks = bytes.Select(b => ToPrintableAscii(b));
        return string.Concat(chunks);
    }
}
