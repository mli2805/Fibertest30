using MediatR;

namespace Fibertest30.Application;

public record CreateLandmarksModelCommand(Guid LandmarksModelId, Guid TraceId) : IRequest<Unit>;

public class CreateLandmarksModelCommandHandler(LandmarksModelManager landmarksModelManager)
    : IRequestHandler<CreateLandmarksModelCommand, Unit>
{
    public async Task<Unit> Handle(CreateLandmarksModelCommand request, CancellationToken cancellationToken)
    {
        await landmarksModelManager.Create(request.LandmarksModelId, request.TraceId);

        return Unit.Value;
    }
}



