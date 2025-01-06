using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetTraceRouteQuery(Guid TraceId) : IRequest<TraceGisData>;

public class GetTraceRouteQueryHandler(Model writeModel) : IRequestHandler<GetTraceRouteQuery, TraceGisData>
{
    public Task<TraceGisData> Handle(GetTraceRouteQuery request, CancellationToken ct)
    {
        var traceGisData = writeModel.GetTraceGisData(request.TraceId);
        return Task.FromResult(traceGisData);
    }
}