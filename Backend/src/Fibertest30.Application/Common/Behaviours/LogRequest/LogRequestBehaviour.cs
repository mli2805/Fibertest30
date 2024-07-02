using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Fibertest30.Application;

public class LogRequestBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> 
    where TRequest : IRequest<TResponse>
{
    
    private readonly ILogger _logger;
    

    public LogRequestBehaviour(ILogger<TRequest> logger)
    {
        _logger = logger;
    }
    
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        var requestName = request.GetType().Name;
        var requestId = LogRequestId.GetRequestId();

        _logger.LogInformation("Request: {Name} {Id} {@Request}", requestName, requestId, request);
        TResponse response;

        var sw = Stopwatch.StartNew();
        try
        {
            response = await next();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Response: {Name} {Id} in {ResponseTime} ms" , requestName, requestId, sw.ElapsedMilliseconds);
            
            // Wrap the exception to ensure it's not logged again by ExceptionInterceptor.
            throw new MediatrLoggedException(ex);
        }

        sw.Stop();
        _logger.LogInformation("Response: {Name} {Id} in {ResponseTime} ms" , requestName, requestId, sw.ElapsedMilliseconds);
        return response;
    }
}