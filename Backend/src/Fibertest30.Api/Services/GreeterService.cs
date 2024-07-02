using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class GreeterService : Greeter.GreeterBase
{
    private readonly ILogger<GreeterService> _logger;
    private readonly ISender _mediator;

    public GreeterService(ILogger<GreeterService> logger, ISender mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }

    public override Task<HelloResponse> SayHello(HelloRequest request, ServerCallContext context)
    {
         var response = new HelloResponse
         {
             Message = "Hello " + request.Name
         };
         return Task.FromResult(response);
    }

    public override async Task StreamHello(HelloRequest request, IServerStreamWriter<HelloResponse> responseStream, ServerCallContext context)
    {
        //while (!context.CancellationToken.IsCancellationRequested)
        {
            foreach (var count in Enumerable.Range(0,3))
            {
                await responseStream.WriteAsync(new HelloResponse()
                {
                    Message = $"{request.Name} {count}" 
                });

                Thread.Sleep(750);
            }
        }
    }
}