using MediatR;

namespace Fibertest30.Application;

public record GetLastMonitoringTraceQuery(int MonitoringPortId, int BaselineId) : IRequest<MeasurementTrace?>;

public class GetLastMonitoringTraceQueryHandler : IRequestHandler<GetLastMonitoringTraceQuery, MeasurementTrace?>
{
    private readonly IMonitoringRepository _monitoringRepository;

    public GetLastMonitoringTraceQueryHandler(IMonitoringRepository monitoringRepository)
    {
        _monitoringRepository = monitoringRepository;
    }

    public async Task<MeasurementTrace?> Handle(GetLastMonitoringTraceQuery request, CancellationToken ct)
    {
        var sorBytes = await _monitoringRepository.GetLastMonitoringResultSor(request.MonitoringPortId,
            request.BaselineId, ct);
        return sorBytes == null? null : new MeasurementTrace(sorBytes);
    }
}