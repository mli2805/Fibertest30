using MediatR;

namespace Fibertest30.Application;

public record ApplyLandmarkChangesCommand(Guid LandmarksModelId) : IRequest<Unit>;

public class ApplyLandmarkChangesCommandHandler(LandmarksModelManager landmarksModelManager)
    : IRequestHandler<ApplyLandmarkChangesCommand, Unit>
{
    public Task<Unit> Handle(ApplyLandmarkChangesCommand request, CancellationToken cancellationToken)
    {
        landmarksModelManager.SaveAllChanges(request.LandmarksModelId);

        return Task.FromResult(Unit.Value);
    }
}