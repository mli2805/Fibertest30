using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class GisService(ISender mediator) : Gis.GisBase
{
    public override async Task<GetTraceRouteResponse> GetTraceRoute(GetTraceRouteRequest request, ServerCallContext context)
    {
        var traceGisData = await mediator.Send(new GetTraceRouteQuery(Guid.Parse(request.TraceId)),
            context.CancellationToken);

        return new GetTraceRouteResponse() { RouteData = traceGisData.ToProto() };
    }

    public override async Task<GetAllGeoDataResponse> GetAllGeoData(GetAllGeoDataRequest request, ServerCallContext context)
    {
        var allGeoData = await mediator.Send(new GetAllGeoDataQuery(), context.CancellationToken);
        return new GetAllGeoDataResponse() { Data = allGeoData.ToProto() };
    }
}
