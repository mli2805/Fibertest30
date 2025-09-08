using Google.Protobuf;
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

    public override async Task<GetUserActonsPdfResponse> GetUserActonsPdf(GetUserActonsPdfRequest request, ServerCallContext context)
    {
        var query = new GetUserActionsPdfQuery(
            Guid.Parse(request.UserId), request.DateTimeFilter.FromProto(), request.OperationCodes.ToList());
        var bytes = await mediator.Send(query, context.CancellationToken);
        return new GetUserActonsPdfResponse() { Pdf = ByteString.CopyFrom(bytes) };
    }

    public override async Task<GetOpticalEventsReportPdfResponse> GetOpticalEventsReportPdf(
        GetOpticalEventsReportPdfRequest request, ServerCallContext context)
    {
        var query = new GetOpticalEventsReportPdfQuery(
            request.IsCurrentEvents, request.DateTimeFilter.FromProto(), 
            request.EventStatuses.Select(e=>e.FromProto()).ToList(), 
            request.TraceStates.Select(s=>s.FromProto()).ToList(), request.IsDetailed, request.IsShowPlace);

        var bytes = await mediator.Send(query, context.CancellationToken);
        return new GetOpticalEventsReportPdfResponse() { Pdf = ByteString.CopyFrom(bytes) };
    }
}
