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
                Guid.Parse(request.TraceId)), context.CancellationToken);

        return new CreateLandmarksModelResponse();
    }

    public override async Task<UpdateLandmarksModelResponse> UpdateLandmarksModel(UpdateLandmarksModelRequest request,
        ServerCallContext context)
    {
        await mediator.Send(
            new UpdateLandmarksModelCommand(Guid.Parse(request.LandmarksModelId), 
                request.ChangedLandmark?.FromProto(), request.HasIsFilterOn ? request.IsFilterOn : null));
        return new UpdateLandmarksModelResponse();
    }

    public override async Task<DeleteLandmarksModelResponse> DeleteLandmarksModel(DeleteLandmarksModelRequest request,
        ServerCallContext context)
    {
        await mediator.Send(new DeleteLandmarksModelCommand(Guid.Parse(request.LandmarksModelId)),
            context.CancellationToken);

        return new DeleteLandmarksModelResponse();
    }

    public override async Task<CancelOneLandmarkChangesResponse> CancelOneLandmarkChanges(CancelOneLandmarkChangesRequest request,
        ServerCallContext context)
    {
        await mediator.Send(new CancelOneLandmarkChangesCommand(
            Guid.Parse(request.LandmarksModelId), request.Row), context.CancellationToken);

        return new CancelOneLandmarkChangesResponse();
    }

    public override async Task<ClearLandmarksModelResponse> ClearLandmarksModel(ClearLandmarksModelRequest request,
        ServerCallContext context)
    {
        await mediator.Send(new ClearLandmarksModelCommand(Guid.Parse(request.LandmarksModelId)),
            context.CancellationToken);

        return new ClearLandmarksModelResponse();
    }

    public override async Task<ApplyLandmarkChangesResponse> ApplyLandmarkChanges(ApplyLandmarkChangesRequest request, 
        ServerCallContext context)
    {
        await mediator.Send(new ApplyLandmarkChangesCommand(Guid.Parse(request.LandmarksModelId)),
            context.CancellationToken);

        return new ApplyLandmarkChangesResponse();
    }
}