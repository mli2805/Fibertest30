using MediatR;

namespace Fibertest30.Application;

public record GetBaselineQuery(int BaselineId) : IRequest<MonitoringBaseline>;

public class GetBaselineQueryHandler : IRequestHandler<GetBaselineQuery, MonitoringBaseline>
{
    private readonly IBaselineRepository _baselineRepository;
    
    public GetBaselineQueryHandler(IBaselineRepository baselineRepository)
    {
        _baselineRepository = baselineRepository;
    }

    public async Task<MonitoringBaseline> Handle(GetBaselineQuery request, CancellationToken ct)
    {
        return await _baselineRepository.Get(request.BaselineId, ct);
    }
}