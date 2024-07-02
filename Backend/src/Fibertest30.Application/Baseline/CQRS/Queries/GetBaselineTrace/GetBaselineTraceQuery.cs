using MediatR;

namespace Fibertest30.Application;

public record GetBaselineTraceQuery(int BaselineId) : IRequest<MeasurementTrace>;

public class GetBaselineTraceQueryHandler : IRequestHandler<GetBaselineTraceQuery, MeasurementTrace>
{
    private readonly IBaselineRepository _baselineRepository;
    
    public GetBaselineTraceQueryHandler(IBaselineRepository baselineRepository)
    {
        _baselineRepository = baselineRepository;
    }

    public async Task<MeasurementTrace> Handle(GetBaselineTraceQuery request, CancellationToken ct)
    {
        var sorBytes = await _baselineRepository.GetSor(request.BaselineId, ct);
        return new MeasurementTrace(sorBytes);
    }
}