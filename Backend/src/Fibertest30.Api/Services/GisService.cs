using FiberizerShared;
using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class GisService(ISender mediator) : Gis.GisBase
{
    public override async Task<GetAllGeoDataResponse> GetAllGeoData(GetAllGeoDataRequest request, ServerCallContext context)
    {
        var allGeoData = await mediator.Send(new GetAllGeoDataQuery(), context.CancellationToken);
        return new GetAllGeoDataResponse() { Data = allGeoData.ToProto() };
    }

    public override async Task<GetFiberInfoResponse> GetFiberInfo(GetFiberInfoRequest request,
        ServerCallContext context)
    {
        var fiberInfo =
            await mediator.Send(new GetFiberInfoQuery(Guid.Parse(request.FiberId)), context.CancellationToken);
        return new GetFiberInfoResponse() { FiberInfo = fiberInfo.ToProto() };
    }
}
