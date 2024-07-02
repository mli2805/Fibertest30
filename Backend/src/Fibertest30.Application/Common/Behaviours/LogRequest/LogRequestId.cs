namespace Fibertest30.Application;

public static class LogRequestId
{
    // _counter is moved await from generic LogRequestBehaviour to use single static variable for all requests
    private static int _counter = 0;
    public static int GetRequestId() => Interlocked.Increment(ref _counter); 
}