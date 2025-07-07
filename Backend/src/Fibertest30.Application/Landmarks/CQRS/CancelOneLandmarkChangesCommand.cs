using MediatR;

namespace Fibertest30.Application;

public record CancelOneLandmarkChangesCommand(Guid LandmarksModelId, int Row) : IRequest<Unit>;

public class CancelOneLandmarkChangesCommandHandler(LandmarksModelManager landmarksModelManager)
    : IRequestHandler<CancelOneLandmarkChangesCommand, Unit>
{
    public Task<Unit> Handle(CancelOneLandmarkChangesCommand request, CancellationToken cancellationToken)
    {
        landmarksModelManager.CancelOneRowChanges(request.LandmarksModelId, request.Row);
        return Task.FromResult(Unit.Value);
    }
}