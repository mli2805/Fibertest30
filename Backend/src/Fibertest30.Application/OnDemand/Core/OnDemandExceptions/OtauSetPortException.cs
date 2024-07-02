namespace Fibertest30.Application;

public enum OtauSetPortExceptionReason
{
    OtauIsNotConnected,
    OtauPortMaintenance,
    OtauPortUnavailable,
    OtauSetPortFailed
}

public class OtauSetPortException : Exception
{
    public OtauSetPortExceptionReason Reason { get; }

    public OtauSetPortException(OtauSetPortExceptionReason reason, string message)
        :base(message)
    {
        Reason = reason;
    }
    
    public OtauSetPortException(OtauSetPortExceptionReason reason, string message, Exception ex)
        :base(message, ex)
    {
        Reason = reason;
    }
}