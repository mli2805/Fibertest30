using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class RtuTreeService : RtuTree.RtuTreeBase
{
    private readonly ILogger<RtuTreeService> _logger;
    private readonly ISender _mediator;

    public RtuTreeService(ILogger<RtuTreeService> logger, ISender mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }

    public override async Task<GetRtuTreeResponse> GetRtuTree(GetRtuTreeRequest request, ServerCallContext context)
    {
        var tree = await _mediator.Send(new GetRtuTreeQuery(), context.CancellationToken);
        return new GetRtuTreeResponse() { Rtus = { tree.Select(r => r.ToProto()) } };
    }

    public override async Task<GetRtuResponse> GetRtu(GetRtuRequest request, ServerCallContext context)
    {
        var rtuDto = await _mediator.Send(new GetRtuQuery(request.RtuId), context.CancellationToken);
        return new GetRtuResponse() { Rtu = rtuDto.ToProto() };
    }
}