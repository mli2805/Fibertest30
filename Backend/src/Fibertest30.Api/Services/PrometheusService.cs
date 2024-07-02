using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class PrometheusService: Prometheus.PrometheusBase
{
    private readonly ISender _mediator;

    public PrometheusService(ISender mediator)
    {
        _mediator = mediator;
    }

    public override async Task<GetCumulativeStatsResponse> GetCumulativeStats(GetCumulativeStatsRequest request, ServerCallContext context)
    {
        var timeRange = request.TimeRange;
        var monitoringPortId = request.MonitoringPortId;
        var metricName = request.MetricName;

        GetCumulativeStatsQuery query = new (timeRange, monitoringPortId, metricName);

        var metrics = await _mediator.Send(query, context.CancellationToken);

        var response = new GetCumulativeStatsResponse
        {
            Metrics = { metrics.Select(m => m.ToProto()) }
        };

        return response;
    }

    public override async Task<GetFiberSectionStatsResponse> GetFiberSectionStats(GetFiberSectionStatsRequest request, ServerCallContext context)
    {
        var timeRange = request.TimeRange;
        var monitoringPortId = request.MonitoringPortId;
        var metricName = request.MetricName;

        GetFiberSectionStatsQuery query = new (timeRange, monitoringPortId, metricName);

        var metrics = await _mediator.Send(query, context.CancellationToken);

        var response = new GetFiberSectionStatsResponse
        {
            Metrics = { metrics.Select(m => m.ToProto()) }
        };

        return response;
    }

    public override async Task<GetFiberEventStatsResponse> GetFiberEventStats(GetFiberEventStatsRequest request, ServerCallContext context)
    {
        var timeRange = request.TimeRange;
        var monitoringPortId = request.MonitoringPortId;
        var metricName = request.MetricName;

        GetFiberEventStatsQuery query = new (timeRange, monitoringPortId, metricName);

        var metrics = await _mediator.Send(query, context.CancellationToken);

        var response = new GetFiberEventStatsResponse
        {
            Metrics = { metrics.Select(m => m.ToProto()) }
        };

        return response;
    }
}