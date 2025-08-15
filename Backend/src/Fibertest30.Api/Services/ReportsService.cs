using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class ReportsService(ISender mediator) : Reports.ReportsBase
{
    public override async Task<GetUserActionLinesResponse> 
        GetUserActionLines(GetUserActionLinesRequest request, ServerCallContext context)
    {
        var query = new GetUserActionLinesQuery(
            Guid.Parse(request.UserId), request.DateTimeFilter.FromProto(), request.OperationCodes.ToList());
        var lines = await mediator.Send(query, context.CancellationToken);
        return new GetUserActionLinesResponse() { Lines = { lines.Select(l => l.ToProto()) } };
    }
}
