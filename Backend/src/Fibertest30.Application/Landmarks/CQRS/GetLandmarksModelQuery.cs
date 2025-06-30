using MediatR;

namespace Fibertest30.Application;

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