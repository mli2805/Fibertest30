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

    public override async Task<GetLandmarksResponse> GetLandmarks(GetLandmarksRequest request,
        ServerCallContext context)
    {
        var landmarks =
            await mediator.Send(new GetLandmarksQuery(Guid.Parse(request.TraceId)), context.CancellationToken);
        return new GetLandmarksResponse() { TraceId = request.TraceId, Landmarks = { landmarks.Select(l=>l.ToProto()) } };
    }

    public override async Task<GetLandmarksModelResponse> GetLandmarksModel(GetLandmarksModelRequest request, ServerCallContext context)
    {
        var landmarksModel =
            await mediator.Send(new GetLandmarksModelQuery(Guid.Parse(request.LandmarksModelId)),
                context.CancellationToken);

        return new GetLandmarksModelResponse() { LandmarksModel = landmarksModel.ToProto() };
    }

    public override async Task<CreateLandmarksModelResponse> CreateLandmarksModel(CreateLandmarksModelRequest request,
        ServerCallContext context)
    {
            await mediator.Send(
                new CreateLandmarksModelCommand(Guid.Parse(request.LandmarksModelId),
                    Guid.Parse(request.TraceId), request.GpsInputMode.FromProto()), context.CancellationToken);

        return new CreateLandmarksModelResponse() { };
    }
}
