using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetTraceLastMeasurementQuery(Guid TraceId) : IRequest<int>;

public class GetTraceLastMeasurementQueryHandler(Model writeModel) : IRequestHandler<GetTraceLastMeasurementQuery, int>
{
    public Task<int> Handle(GetTraceLastMeasurementQuery request, CancellationToken cancellationToken)
    {
        var meas = writeModel.Measurements.Last(m => m.TraceId == request.TraceId);
        return Task.FromResult(meas.SorFileId);
    }
}
