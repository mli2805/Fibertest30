namespace Fibertest30.Application;
public class AlarmProfileIsUsedException : Exception
{
    public AlarmProfileIsUsedException(string message) : base(message)
    {
    }
}
