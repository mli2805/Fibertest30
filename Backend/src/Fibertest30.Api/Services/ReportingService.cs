using Google.Protobuf;
using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class ReportingService : Reporting.ReportingBase
{
    private readonly ISender _mediator;

    public ReportingService(ISender mediator)
    {
        _mediator = mediator;
    }

    public override async Task<GetSystemEventsResponse> GetSystemEvents(GetSystemEventsRequest request, ServerCallContext context)
    {
        var systemEvents = await _mediator.Send(
            new GetSystemEventsQuery(),
            context.CancellationToken);

        var response = new GetSystemEventsResponse()
        {
            SystemEvents = { systemEvents.Select(x => x.ToProto()) }
        };
        
        return response;
    }

}
