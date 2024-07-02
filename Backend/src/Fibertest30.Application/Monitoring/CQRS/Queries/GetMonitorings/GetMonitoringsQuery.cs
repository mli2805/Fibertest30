using MediatR;

namespace Fibertest30.Application;

public record GetMonitoringsQuery(List<int> PortIds, DateTimeFilter DateTimeFilter) : IRequest<List<MonitoringResult>>;

public class GetMonitoringsQueryHandler : IRequestHandler<GetMonitoringsQuery, List<MonitoringResult>>
{
    private readonly IMonitoringRepository _monitoringRepository;
    
    public GetMonitoringsQueryHandler(IMonitoringRepository monitoringRepository)
    {
        _monitoringRepository = monitoringRepository;
    }

    public async Task<List<MonitoringResult>> Handle(GetMonitoringsQuery request, CancellationToken ct)
    {
        return await _monitoringRepository.GetFilteredPortion(request.PortIds, request.DateTimeFilter, ct);
    }
}