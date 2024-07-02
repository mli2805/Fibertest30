using MediatR;

namespace Fibertest30.Application;

public record GetMonitoringTraceQuery(int MonitoringId) : IRequest<MeasurementTrace>;

public class GetMonitoringTraceQueryHandler : IRequestHandler<GetMonitoringTraceQuery, MeasurementTrace>
{
    private readonly IMonitoringRepository _monitoringRepository;
    
    public GetMonitoringTraceQueryHandler(IMonitoringRepository monitoringRepository)
    {
        _monitoringRepository = monitoringRepository;
    }

    public async Task<MeasurementTrace> Handle(GetMonitoringTraceQuery request, CancellationToken ct)
    {
        var sorBytes = await _monitoringRepository.GetSor(request.MonitoringId);
        return new MeasurementTrace(sorBytes);
    }
}