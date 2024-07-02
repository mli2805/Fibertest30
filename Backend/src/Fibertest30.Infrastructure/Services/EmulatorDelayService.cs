using Fibertest30.Infrastructure.Emulator;

namespace Fibertest30.Infrastructure;

public class EmulatorDelayService : IEmulatorDelayService
{
    private static readonly Random _random = new Random();
    
    public async Task EmulateDelay(int milliseconds, CancellationToken ct)
    {
        await Task.Delay(milliseconds, ct);
    }

    public Task EmulateDelay(CancellationToken ct)
    {
        return RandomDelay(300, 1000, ct);
    }

    private static async Task RandomDelay(int minMs, int maxMs, CancellationToken ct)
    {
        if (minMs > maxMs)
            throw new ArgumentException("minMs should be less than or equal to maxMs");

        var delayMilliseconds = _random.Next(minMs, maxMs);
        await Task.Delay(delayMilliseconds, ct);
    }
}

public class TestDelayService : IEmulatorDelayService
{
    public Task EmulateDelay(CancellationToken ct)
    {
        return Task.CompletedTask;
    }

    public Task EmulateDelay(int milliseconds, CancellationToken ct)
    {
        return Task.CompletedTask;
    }
}
