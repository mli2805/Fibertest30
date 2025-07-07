using MediatR;

namespace Fibertest30.Application;

public record ApplyLandmarkChangesCommand(List<Guid> LandmarksModelIds) : IRequest<Unit>;

public class ApplyLandmarkChangesCommandHandler(LandmarksModelManager landmarksModelManager)
    : IRequestHandler<ApplyLandmarkChangesCommand, Unit>
{
    public async Task<Unit> Handle(ApplyLandmarkChangesCommand request, CancellationToken cancellationToken)
    {
       await landmarksModelManager.SaveAllChanges(request.LandmarksModelIds);

    return Unit.Value;
    }
}