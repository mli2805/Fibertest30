using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class RftsEventsService(ISender mediator) : RftsEvents.RftsEventsBase
{
    public override async Task<GetRftsEventsResponse> GetRftsEvents(GetRftsEventsRequest request,
        ServerCallContext context)
    {
        var rftsEventsDto = await mediator.Send(new GetRftsEventsQuery(request.SorFileId), context.CancellationToken);
        return new GetRftsEventsResponse() { RftsEventsData = rftsEventsDto.ToProto() };
    }
}
