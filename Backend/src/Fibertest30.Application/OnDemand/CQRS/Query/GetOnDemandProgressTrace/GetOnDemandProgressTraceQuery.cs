using MediatR;

namespace Fibertest30.Application;

public record GetOnDemandProgressTraceQuery(string OnDemandId) : IRequest<MeasurementTrace?>;

public class GetOnDemandProgressTraceQueryHandler : IRequestHandler<GetOnDemandProgressTraceQuery, MeasurementTrace?>
{
    private readonly IOnDemandService _onDemandService;
    
    public GetOnDemandProgressTraceQueryHandler(IOnDemandService onDemandService)
    {
        _onDemandService = onDemandService;
    }

    public Task<MeasurementTrace?> Handle(GetOnDemandProgressTraceQuery request,
        CancellationToken cancellationToken)
    {
        var sorData = _onDemandService.GetProgressTrace(request.OnDemandId);
        return Task.FromResult(sorData);
    }
}