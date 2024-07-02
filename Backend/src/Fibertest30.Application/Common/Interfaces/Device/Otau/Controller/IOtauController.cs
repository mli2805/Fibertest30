using Fibertest30.Application;

public interface IOtauController {
    OtauType OtauType { get; }
    Task<OtauDiscover?> Discover(CancellationToken ct);
    Task<bool> Ping(CancellationToken ct);
    Task<bool> Connect(CancellationToken ct);
    Task Disconnect(CancellationToken ct);
    Task SetPort(int port, CancellationToken ct);
    Task<bool> Blink(CancellationToken ct);
}