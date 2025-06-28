using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record CreateLandmarksModelCommand(Guid LandmarksModelId, Guid TraceId, GpsInputMode Mode) : IRequest<Unit>;

public class CreateLandmarksModelCommandHandler(LandmarksModelManager landmarksModelManager)
    : IRequestHandler<CreateLandmarksModelCommand, Unit>
{
    public async Task<Unit> Handle(CreateLandmarksModelCommand request, CancellationToken cancellationToken)
    {
        var model = await landmarksModelManager.Create(request.LandmarksModelId, request.TraceId, request.Mode);

        return Unit.Value;
    }
}

public record GetLandmarksModelQuery(Guid LandmarksModelId) : IRequest<LandmarksModel>;

public class GetLandmarksModelQueryHandler(LandmarksModelManager landmarksModelManager)
    : IRequestHandler<GetLandmarksModelQuery, LandmarksModel>
{
    public Task<LandmarksModel> Handle(GetLandmarksModelQuery request, CancellationToken cancellationToken)
    {
        var model = landmarksModelManager.Get(request.LandmarksModelId);
        if (model == null)
            throw new Exception("Landmark model not found");
        return Task.FromResult(model);
    }
}