using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class LandmarksService(ISender mediator) : Landmarks.LandmarksBase
{
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