using MediatR;

namespace Fibertest30.Application;

public record GetBaselinesQuery(List<int> portIds) : IRequest<List<MonitoringBaseline>>;

public record GetBaselinesQueryHandler : IRequestHandler<GetBaselinesQuery, List<MonitoringBaseline>>
{
    private readonly IBaselineRepository _baselineRepository;

    public GetBaselinesQueryHandler(IBaselineRepository baselineRepository)
    {
        _baselineRepository = baselineRepository;
    }

    public async Task<List<MonitoringBaseline>> Handle(GetBaselinesQuery request, CancellationToken cancellationToken)
    {
        return await _baselineRepository.GetFilteredPortion(request.portIds, true, cancellationToken);
    }
}
