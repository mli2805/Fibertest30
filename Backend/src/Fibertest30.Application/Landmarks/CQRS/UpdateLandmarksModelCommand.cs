using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record UpdateLandmarksModelCommand(
    Guid LandmarksModelId, ColoredLandmark? ChangedLandmark, bool? IsFilterOn) : IRequest<Unit>;

public class UpdateLandmarksModelCommandHandler(LandmarksModelManager landmarksModelManager)
    : IRequestHandler<UpdateLandmarksModelCommand, Unit>
{
    public async Task<Unit> Handle(UpdateLandmarksModelCommand request, CancellationToken cancellationToken)
    {
        if (request.ChangedLandmark != null)
        {
            await landmarksModelManager.UpdateOneLandmark(request.LandmarksModelId, request.ChangedLandmark);
        }
        else if (request.IsFilterOn != null)
        {
            landmarksModelManager.UpdateFilterEmptyNodes(request.LandmarksModelId, (bool)request.IsFilterOn);
        }

        return Unit.Value;
    }
}