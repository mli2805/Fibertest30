using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class GraphService : Graph.GraphBase
{
    private readonly ISender _mediator;

    public GraphService(ISender mediator)
    {
        _mediator = mediator;
    }

    public override async Task<SendCommandResponse> SendCommand(SendCommandRequest request,
        ServerCallContext context)
    {
        var result = await _mediator.Send(new GraphCommand(request.Command, request.CommandType), context.CancellationToken);

        return new SendCommandResponse() { Success = string.IsNullOrEmpty(result), Error = result ?? "" };
    }

}
