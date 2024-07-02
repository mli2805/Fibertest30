namespace Fibertest30.Application;

public class FailedToConnectEmailServerException : Exception
{
    public FailedToConnectEmailServerException(string? message) : base(message)
    {
    }
}

public class FailedToAuthenticateException : Exception
{
    public FailedToAuthenticateException(string? message) : base(message)
    {
    }
}

public class FailedToSendEmailException : Exception
{
    public FailedToSendEmailException(string? message) : base(message)
    {
    }
}

public class FailedToVerifySmtpServerCertificateException : Exception
{
    public FailedToVerifySmtpServerCertificateException(string? message) : base(message)
    {
    }
}
