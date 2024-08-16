namespace Fibertest30.Application;

public class FailedToConnectRtuException : Exception
{
    public FailedToConnectRtuException(string? message) : base(message)
    {
    }
}

public class RtuIsBusyException : Exception
{
    public RtuIsBusyException(string? message) : base(message)
    {
    }
}

public class NoSuchRtuException : Exception
{
    public NoSuchRtuException(string? message) : base(message)
    {
    }
}

public class DeserializationException : Exception
{
    public DeserializationException(string? message) : base(message)
    {
    }
}
