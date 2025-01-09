using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetAllGeoDataQuery() : IRequest<AllGisData>;

public class GetAllGeoDataQueryHandler(Model writeModel) : IRequestHandler<GetAllGeoDataQuery, AllGisData>
{
    public Task<AllGisData> Handle(GetAllGeoDataQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(writeModel.GetAllGisData());
    }
}