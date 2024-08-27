
namespace Fibertest30.Infrastructure.Services;
public class DelayService : IDelayService
{
    public void Sleep(int milliseconds)
    {
        Thread.Sleep(milliseconds);
    }

    public Task Delay(int milliseconds)
    {
        return Task.Delay(milliseconds);
    }

    public Task Delay(int milliseconds, CancellationToken ct)
    {
        return Task.Delay(milliseconds, ct);
    }
}

