using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetGisDataQuery : IRequest<GisData>;

public class GetGisDataQueryHandler(Model writeModel) : IRequestHandler<GetGisDataQuery, GisData>
{

    public Task<GisData> Handle(GetGisDataQuery request, CancellationToken cancellationToken)
    {
        var gisData = writeModel.GetGisData();
        return Task.FromResult(gisData);
    }
}