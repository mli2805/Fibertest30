using MediatR;

namespace Fibertest30.Application;

public record ClearLandmarksModelCommand(Guid LandmarksModelId) : IRequest<Unit>;

public class ClearLandmarksModelCommandHandler(LandmarksModelManager landmarksModelManager)
    : IRequestHandler<ClearLandmarksModelCommand, Unit>
{
    public Task<Unit> Handle(ClearLandmarksModelCommand request, CancellationToken cancellationToken)
    {
        landmarksModelManager.CancelChanges(request.LandmarksModelId);
        return Task.FromResult(Unit.Value);
    }
}