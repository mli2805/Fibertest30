namespace Fibertest30.Application;

public interface IDelayService
{
    public void Sleep(int milliseconds);

    public Task Delay(int milliseconds);

    public Task Delay(int milliseconds, CancellationToken ct);
}
