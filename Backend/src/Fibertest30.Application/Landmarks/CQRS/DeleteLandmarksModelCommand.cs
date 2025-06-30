using MediatR;

namespace Fibertest30.Application;

public record DeleteLandmarksModelCommand(Guid LandmarksModelId) : IRequest<Unit>;

public class DeleteLandmarksModelCommandHandler(LandmarksModelManager landmarksModelManager)
    : IRequestHandler<DeleteLandmarksModelCommand, Unit>
{
    public Task<Unit> Handle(DeleteLandmarksModelCommand request, CancellationToken cancellationToken)
    {
        landmarksModelManager.DeleteModel(request.LandmarksModelId);
        return Task.FromResult(Unit.Value);
    }
}