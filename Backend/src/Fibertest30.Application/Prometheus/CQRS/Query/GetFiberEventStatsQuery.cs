using MediatR;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Text.Json;

namespace Fibertest30.Application;

public record GetFiberEventStatsQuery(string TimeRange, int MonitoringPortId, string MetricName) : IRequest<FiberEventMetric[]>;

public class GetFiberEventStatsQueryHandler : IRequestHandler<GetFiberEventStatsQuery, FiberEventMetric[]?>
{
    public class PrometheusResponse
    {
        public string? Status { get; set; }
        public Data? Data { get; set; }
    }
    public class Data
    {
        public ResultItem[]? Result { get; set; }
    }
    public class Metric
    {
        public string? Index { get; set; }
        public string? Wavelength { get; set; }
    }
    public class ResultItem
    {
        public Metric? Metric { get; set; }
        public JsonElement[][]? Values { get; set; }
    }

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<GetFiberEventStatsQueryHandler> _logger;
    private readonly IPrometheusQueryStringBuilder _prometheusQueryStringBuilder;

    public GetFiberEventStatsQueryHandler(IPrometheusQueryStringBuilder prometheusQueryStringBuilder, IHttpClientFactory httpClientFactory, ILogger<GetFiberEventStatsQueryHandler> logger)
    {
        _prometheusQueryStringBuilder = prometheusQueryStringBuilder;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<FiberEventMetric[]?> Handle(GetFiberEventStatsQuery request, CancellationToken ct)
    {
        FiberEventMetric[]? result = null;

        var queryString = _prometheusQueryStringBuilder.Build(request.MetricName, request.MonitoringPortId, request.TimeRange);
        var httpClient = _httpClientFactory.CreateClient("prometheus");

        if (string.IsNullOrEmpty(httpClient.BaseAddress?.AbsoluteUri))
        {
            _logger.LogWarning("Cannot GetFiberEventStats because Prometheus is disabled");
            return Array.Empty<FiberEventMetric>();
        }

        using var response = await httpClient.GetAsync(queryString, ct);
        if (response.IsSuccessStatusCode)
        {
            string json = await response.Content.ReadAsStringAsync(ct);
            result = Parse(json);
        }

        return result;
    }

    private static FiberEventMetric[]? Parse(string json)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        var prometheusResponse = JsonSerializer.Deserialize<PrometheusResponse>(json, options);

        if (prometheusResponse?.Status == "success")
        {
            var result = prometheusResponse.Data?.Result?.Select(ri =>
                new FiberEventMetric
                {
                    Index = !int.TryParse(ri.Metric?.Index, CultureInfo.InvariantCulture, out int index)
                        ? 0 
                        : index,
                    Wavelength = ri.Metric?.Wavelength,
                    DataPoints = ri.Values?.Select(v =>
                    {
                        var x = v[0].GetInt64();
                        var y = double.Parse(v[1].ToString(), CultureInfo.InvariantCulture);
                        return new DataPoint { X = DateTimeOffset.FromUnixTimeSeconds(x).DateTime, Y = y };
                    }).ToArray() ?? Array.Empty<DataPoint>()
                }
            ).ToArray();

            return result;
        }
        return Array.Empty<FiberEventMetric>();
    }
}