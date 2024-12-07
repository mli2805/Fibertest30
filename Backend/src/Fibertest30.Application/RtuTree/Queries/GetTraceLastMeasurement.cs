using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetTraceLastMeasurement(Guid traceId) : IRequest<int>;

public class GetTraceLastMeasurementHandler : IRequestHandler<GetTraceLastMeasurement, int>
{
    private readonly Model _writeModel;

    public GetTraceLastMeasurementHandler(Model writeModel)
    {
        _writeModel = writeModel;
    }

    public Task<int> Handle(GetTraceLastMeasurement request, CancellationToken cancellationToken)
    {
        var meas = _writeModel.Measurements.Last(m => m.TraceId == request.traceId);
        return Task.FromResult(meas.SorFileId);
    }
}
