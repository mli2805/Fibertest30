using MediatR;

namespace Fibertest30.Application;

public record GetMonitoringQuery(int MonitoringId, bool AddExtra) : IRequest<MonitoringResult>;

public class GetMonitoringQueryHandler : IRequestHandler<GetMonitoringQuery, MonitoringResult>
{
    private readonly IMonitoringRepository _monitoringRepository;
    
    public GetMonitoringQueryHandler(IMonitoringRepository monitoringRepository)
    {
        _monitoringRepository = monitoringRepository;
    }

    public async Task<MonitoringResult> Handle(GetMonitoringQuery request, CancellationToken ct)
    {
        return await _monitoringRepository.Get(request.MonitoringId, request.AddExtra);
    }
}