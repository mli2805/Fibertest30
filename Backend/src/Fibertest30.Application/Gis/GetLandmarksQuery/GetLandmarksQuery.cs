using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetLandmarksQuery(Guid TraceId): IRequest<List<Landmark>>;

public class GetLandmarksQueryHandler(LandmarksProvider landmarksProvider) : IRequestHandler<GetLandmarksQuery, List<Landmark>>
{
    public async Task<List<Landmark>> Handle(GetLandmarksQuery request, CancellationToken cancellationToken)
    {
        var landmarks = await landmarksProvider.GetLandmarks(request.TraceId);
        return landmarks;
    }
}