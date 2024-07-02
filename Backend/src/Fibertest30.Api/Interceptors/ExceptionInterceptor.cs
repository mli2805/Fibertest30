using Grpc.Core;
using Grpc.Core.Interceptors;

namespace Fibertest30.Api;

public class ExceptionInterceptor : Interceptor
{
    private readonly ILogger<ExceptionInterceptor> _logger;

    public ExceptionInterceptor(ILogger<ExceptionInterceptor> logger)
    {
        _logger = logger;
    }
    
    public override async Task<TResponse> UnaryServerHandler<TRequest, TResponse>(
        TRequest request,
        ServerCallContext context,
        UnaryServerMethod<TRequest, TResponse> continuation)
    {
        try
        {
            return await continuation(request, context);
        }
        catch (Exception ex)
        {
            ex = UnwrapMediatrExceptionOrLog(ex, request, context);
            throw ToRpcException(ex);
        }
    }

    public override async Task ServerStreamingServerHandler<TRequest, TResponse>(TRequest request,
        IServerStreamWriter<TResponse> responseStream,
        ServerCallContext context, ServerStreamingServerMethod<TRequest, TResponse> continuation)
    {
        try
        {
            await continuation(request, responseStream, context);
        }
        catch (Exception ex)
        {
            ex = UnwrapMediatrExceptionOrLog(ex, request, context);
            throw ToRpcException(ex);
        }
    }

    private Exception UnwrapMediatrExceptionOrLog<TRequest>(Exception ex, TRequest request, ServerCallContext context)
    {
        // MediatrLoggedException was already logged
        // just unwrap it
        if (ex is MediatrLoggedException mediatrException)
        {
            return mediatrException.InnerException!;
        }
        
        _logger.LogError(ex, "GrpcRequest: Unhandled Exception for GrpcRequest {Method} {@Request}", context.Method, request);
        return ex;
    }

    private RpcException ToRpcException(Exception ex)
    {
        var statusCode = StatusCode.Unknown;
        var message = "UnknownError";

        if (ex is UnauthorizedAccessException)
        {
            statusCode = StatusCode.PermissionDenied;
            message = "UnauthorizedAccess";
        }

        if (ex is OnDemandAlreadyStartedException)
        {
            statusCode = StatusCode.FailedPrecondition;
            message = "OnDemandAlreadyStarted";
        }

        if (ex is AlarmProfileIsUsedException)
        {
            statusCode = StatusCode.FailedPrecondition;
            message = "AlarmProfileIsUsed";
        }

        if (ex is BaselineAlreadyStartedException)
        {
            statusCode = StatusCode.FailedPrecondition;
            message = "BaselineAlreadyStarted";
        }

        if (ex is FailedToConnectEmailServerException)
        {
            statusCode = StatusCode.Aborted;
            message = "FailedToConnectEmailServer";
        }

        if (ex is FailedToAuthenticateException)
        {
            statusCode = StatusCode.Unauthenticated;
            message = "UnauthorizedAccess";
        }

        if (ex is FailedToSendEmailException)
        {
            statusCode = StatusCode.Aborted;
            message = "FailedToSendEmail";
        }

        if (ex is FluentValidation.ValidationException)
        {
            statusCode = StatusCode.InvalidArgument;
            message = ex.Message;
        }

        if (ex is FailedToVerifySmtpServerCertificateException)
        {
            statusCode = StatusCode.Aborted;
            message = "FailedToVerifySmtpServerCertificate";
        }

        var status = new Status(statusCode, message);
        return new RpcException(status);
    }
}