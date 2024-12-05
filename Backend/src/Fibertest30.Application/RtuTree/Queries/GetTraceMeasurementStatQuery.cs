using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;
public record GetTraceMeasurementStatQuery(Guid TraceId) : IRequest<List<MeasurementStat>>;

public class GetTraceMeasurementStatQueryHandler : IRequestHandler<GetTraceMeasurementStatQuery, List<MeasurementStat>>
{
    private readonly Model _writeModel;

    public GetTraceMeasurementStatQueryHandler(Model writeModel)
    {
        _writeModel = writeModel;
    }

    public Task<List<MeasurementStat>> Handle(GetTraceMeasurementStatQuery request, CancellationToken cancellationToken)
    {
        var measurements = _writeModel.Measurements
            .Where(t => t.TraceId == request.TraceId)
            .OrderByDescending(l=>l.EventRegistrationTimestamp)
            .Select(m => new MeasurementStat()
            {
                SorFileId = m.SorFileId,
                BaseRefType = m.BaseRefType,
                RegisteredAt = m.EventRegistrationTimestamp,
                IsEvent = m.EventStatus >= EventStatus.EventButNotAnAccident,
                TraceState = m.TraceState
            }).ToList();

        return Task.FromResult(measurements);
    }
}

