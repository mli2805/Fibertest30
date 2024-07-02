namespace Fibertest30.Application;

public class DisposableObservable<T> : IDisposable
{
    public IObservable<T> Observable { get; }
    private readonly Action _disposer;

    public DisposableObservable(IObservable<T> observable, Action disposer)
    {
        Observable = observable;
        _disposer = disposer;
    }

    public void Dispose()
    {
        _disposer?.Invoke();
    }
}