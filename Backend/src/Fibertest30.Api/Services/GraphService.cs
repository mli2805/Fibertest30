using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class GraphService(ISender mediator) : Graph.GraphBase
{
    public override async Task<SendCommandResponse> SendCommand(SendCommandRequest request,
        ServerCallContext context)
    {
        var httpContext = context.GetHttpContext();
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "";

        var result = await mediator
            .Send(new GraphCommand(request.Command, request.CommandType, ip), context.CancellationToken);

        return new SendCommandResponse() { Success = string.IsNullOrEmpty(result), Error = result ?? "" };
    }

}
