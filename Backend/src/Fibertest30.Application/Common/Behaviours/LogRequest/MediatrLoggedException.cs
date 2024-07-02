namespace Fibertest30.Application;

public class MediatrLoggedException : Exception
{
    public MediatrLoggedException(Exception innerException)
        : base(innerException.Message, innerException)
    {
    }
}