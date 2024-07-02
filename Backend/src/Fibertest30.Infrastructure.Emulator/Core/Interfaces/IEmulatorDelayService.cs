namespace Fibertest30.Infrastructure.Emulator;

public interface IEmulatorDelayService
{
    Task EmulateDelay(CancellationToken ct);

    Task EmulateDelay(int milliseconds, CancellationToken ct);
}