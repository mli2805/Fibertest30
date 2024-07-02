using MediatR;

namespace Fibertest30.Application;

public record GetCompletedOnDemandTraceQuery(string OnDemandId) : IRequest<MeasurementTrace>;

public class GetCompletedOnDemandTraceQueryHandler : IRequestHandler<GetCompletedOnDemandTraceQuery, MeasurementTrace>
{
    private readonly IOnDemandRepository _onDemandRepository;

    public GetCompletedOnDemandTraceQueryHandler(IOnDemandRepository onDemandRepository)
    {
        _onDemandRepository = onDemandRepository;
    }

    public async Task<MeasurementTrace> Handle(GetCompletedOnDemandTraceQuery request,
        CancellationToken cancellationToken)
    {
        var sorBytes = await _onDemandRepository.GetSor(request.OnDemandId);
        return new MeasurementTrace(sorBytes);
    }
}