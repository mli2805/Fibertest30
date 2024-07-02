namespace Fibertest30.Application;

public class BaselineAlreadyStartedException : Exception
{
    public BaselineAlreadyStartedException(string message)
        :base(message)
    {
        
    }
}