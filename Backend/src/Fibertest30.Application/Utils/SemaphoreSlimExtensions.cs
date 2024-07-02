namespace Fibertest30.Application;

public static class SemaphoreSlimExtensions
{
    public static async ValueTask<IDisposable> LockAsync(this SemaphoreSlim semaphore, CancellationToken ct)
    {
        await semaphore.WaitAsync(ct);
        return new SemaphoreReleaser(semaphore);
    }

    private sealed class SemaphoreReleaser : IDisposable
    {
        private readonly SemaphoreSlim _semaphore;

        public SemaphoreReleaser(SemaphoreSlim semaphore)
        {
            _semaphore = semaphore ?? 
                         throw new ArgumentNullException(nameof(semaphore));
        }

        public void Dispose()
        {
            _semaphore.Release();
        }
    }
}