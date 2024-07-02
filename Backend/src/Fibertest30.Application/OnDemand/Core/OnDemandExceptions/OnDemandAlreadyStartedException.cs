namespace Fibertest30.Application;

public class OnDemandAlreadyStartedException : Exception
{
    public OnDemandAlreadyStartedException(string message)
    :base(message)
    {
        
    }
}