using Fibertest30.Api.Protos;
using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class RtuMgmtService : RtuMgmt.RtuMgmtBase
{
    private readonly ILogger<RtuMgmtService> _logger;
    private readonly ISender _mediator;

    public RtuMgmtService(ILogger<RtuMgmtService> logger, ISender mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }

    public override async Task<TestRtuConnectionResponse> TestRtuConnection(TestRtuConnectionRequest request,
        ServerCallContext context)
    {
        var rtuConnectionCheckedDto = await _mediator
            .Send(new TestRtuConnectionCommand(request.NetAddress.FromProto()), context.CancellationToken);
        return new TestRtuConnectionResponse()
        {
            NetAddress = rtuConnectionCheckedDto.NetAddress.ToProto(), 
            IsConnectionSuccessful = rtuConnectionCheckedDto.IsConnectionSuccessfull
        };
    }
}