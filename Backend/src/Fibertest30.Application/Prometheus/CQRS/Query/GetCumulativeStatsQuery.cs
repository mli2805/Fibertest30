using MediatR;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Text.Json;

namespace Fibertest30.Application;

public record GetCumulativeStatsQuery(string TimeRange, int MonitoringPortId, string MetricName) : IRequest<CumulativeMetric[]>;

public class GetCumulativeStatsQueryHandler : IRequestHandler<GetCumulativeStatsQuery, CumulativeMetric[]?>
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
        public string? Wavelength { get; set; }
    }
    public class ResultItem
    {
        public Metric? Metric { get; set; }
        public JsonElement[][]? Values { get; set; }
    }

    private readonly IPrometheusQueryStringBuilder _prometheusQueryStringBuilder;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<GetCumulativeStatsQueryHandler> _logger;

    public GetCumulativeStatsQueryHandler(IPrometheusQueryStringBuilder prometheusQueryStringBuilder, IHttpClientFactory httpClientFactory, ILogger<GetCumulativeStatsQueryHandler> logger)
    {
        _prometheusQueryStringBuilder = prometheusQueryStringBuilder;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<CumulativeMetric[]?> Handle(GetCumulativeStatsQuery request, CancellationToken ct)
    {
        CumulativeMetric[]? result = null;

        var queryString = _prometheusQueryStringBuilder.Build(request.MetricName, request.MonitoringPortId, request.TimeRange);
        var httpClient = _httpClientFactory.CreateClient("prometheus");

        if (string.IsNullOrEmpty(httpClient.BaseAddress?.AbsoluteUri))
        {
            _logger.LogWarning("Cannot GetCumulativeStats because Prometheus is disabled");
            return Array.Empty<CumulativeMetric>();
        }

        using var response = await httpClient.GetAsync(queryString, ct);
        if (response.IsSuccessStatusCode)
        {
            string json = await response.Content.ReadAsStringAsync(ct);
            result = Parse(json);
        }

        return result;
    }

    private CumulativeMetric[]? Parse(string json)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        var prometheusResponse = JsonSerializer.Deserialize<PrometheusResponse>(json, options);

        if (prometheusResponse?.Status == "success")
        {
            var result = prometheusResponse.Data?.Result?.Select(ri => new CumulativeMetric
            {
                Wavelength = ri.Metric?.Wavelength,
                DataPoints = ri.Values?.Select(v =>
                {
                    var x = v[0].GetInt64();
                    var y = double.Parse(v[1].ToString(), CultureInfo.InvariantCulture);
                    return new DataPoint
                    {
                        X = DateTimeOffset.FromUnixTimeSeconds(x).DateTime,
                        Y = y
                    };
                }).ToArray() ?? Array.Empty<DataPoint>()
            }).ToArray();

            return result;
        }
        return Array.Empty<CumulativeMetric>();
    }
}