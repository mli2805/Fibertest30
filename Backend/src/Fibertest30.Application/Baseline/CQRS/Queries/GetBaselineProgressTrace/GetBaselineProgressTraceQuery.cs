using MediatR;

namespace Fibertest30.Application;

public record GetBaselineProgressTraceQuery(string TaskId) : IRequest<MeasurementTrace?>;

public class GetBaselineProgressTraceQueryHandler : IRequestHandler<GetBaselineProgressTraceQuery, MeasurementTrace?>
{
    private readonly IBaselineSetupService _baselineSetup;
    
    public GetBaselineProgressTraceQueryHandler(IBaselineSetupService baselineSetup)
    {
        _baselineSetup = baselineSetup;
    }

    public Task<MeasurementTrace?> Handle(GetBaselineProgressTraceQuery request,
        CancellationToken cancellationToken)
    {
        var sorData = _baselineSetup.GetProgressTrace(request.TaskId);
        return Task.FromResult(sorData);
    }
}