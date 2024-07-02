using Google.Protobuf;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Optixsoft.SorExaminer;
using Prometheus;
using Fibertest30.Applications;
using Snappier;
using System.Globalization;
using System.Net.Http.Headers;

namespace Fibertest30.Application;

public class PrometheusPushService : IPrometheusPushService
{
    private readonly ILogger<IPrometheusPushService> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly bool _prometheusIsSet;

    public PrometheusPushService(IConfiguration configuration, ILogger<IPrometheusPushService> logger, IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;

        string? prometheusBase = configuration["PrometheusBase"];

        if (!string.IsNullOrEmpty(prometheusBase))
        {
            _prometheusIsSet = true;
            _logger.LogInformation("Prometheus: {PrometheusBase}", prometheusBase);
        }
        else
        {
            _logger.LogInformation("Prometheus: not enabled, please configure \"PrometheusBase\"={DefaultPrometheusBase}", "http://localhost:9090/api/v1/");
        }
    }

    public void PushMetrics(int monitoringPortId, byte[] trace, DateTime completedAt, CancellationToken ct)
    {
        if (!_prometheusIsSet) return;
        if (ct.IsCancellationRequested) return;

        // don't need to block inside this method,
        // so make this call on a ThreadPool

        Task.Run(async () =>
        {
            try
            {
                var metrics = GetMetrics(monitoringPortId, trace);
                await SendMetrics(metrics, completedAt, ct);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An error occurred while sending the metrics to Prometheus");
            }
        }, ct);
    }

    private List<(string metric, List<(string name, string value)> labels, double value)> GetMetrics(int monitoringPortId, byte[] trace)
    {
        var sorData = trace.ToSorData().LoadSorData();

        var metrics = new SorDataMetrics(sorData);
        var latency = sorData.Span.GetLatency();

        List<(string metric, List<(string name, string value)> labels, double value)> result = new();

        int wavelength = sorData.NominalWavelength;

        var commonLabels = new List<(string name, string value)> { ("monitoring_port_id", monitoringPortId.ToString(CultureInfo.InvariantCulture)), ("wavelength", wavelength.ToString(CultureInfo.InvariantCulture)) };

        result.Add(("latency", commonLabels, latency * 1000000)); // to ns
        result.Add(("total_loss", commonLabels, metrics.CumulativeStats.totalLoss));
        result.Add(("total_orl", commonLabels, metrics.CumulativeStats.totalOrl));

        foreach (var fiberEvent in metrics.FiberEvents!)
        {
            var labels = commonLabels.ToList(); // copy
            labels.Add(("index", fiberEvent.index.ToString(CultureInfo.InvariantCulture)));

            result.Add(("fiber_event_loss", labels, fiberEvent.loss));
            result.Add(("fiber_event_reflectance", labels, fiberEvent.reflectance));
        }
        foreach (var fiberSection in metrics.FiberSections!)
        {
            var labels = commonLabels.ToList(); // copy
            labels.Add(("index", fiberSection.index.ToString(CultureInfo.InvariantCulture)));

            result.Add(("fiber_section_loss", labels, fiberSection.loss));
            result.Add(("fiber_section_attenuation", labels, fiberSection.attenuation));
        }

        return result;
    }


    private async Task SendMetrics(List<(string metric, List<(string name, string value)> labels, double value)> metrics, DateTime completedAt, CancellationToken ct)
    {
        if (ct.IsCancellationRequested) return;

        var writeRequest = new WriteRequest();

        foreach (var m in metrics)
        {
            var ts = CreateTimeSeries(m.metric, m.labels, completedAt, m.value);
            writeRequest.Timeseries.Add(ts);
        }

        await Send(writeRequest, ct);
    }

    private async Task Send(WriteRequest writeRequest, CancellationToken ct)
    {
        byte[] uncompressed = writeRequest.ToByteString().ToByteArray();
        byte[] compressed = Snappy.CompressToArray(uncompressed);

        var content = new ByteArrayContent(compressed);
        content.Headers.ContentEncoding.Add("snappy");
        content.Headers.ContentType = new MediaTypeHeaderValue("application/x-protobuf");

        var request = new HttpRequestMessage
        {
            Method = HttpMethod.Post,
            RequestUri = new Uri("write", UriKind.Relative),
            Headers =
            {
                { "X-Prometheus-Remote-Write-Version", "0.1.0" },
                { "User-Agent", "metrics-worker" }
            },
            Content = content
        };

        var httpClient = _httpClientFactory.CreateClient("prometheus");
        using (var response = await httpClient.SendAsync(request, ct))
        {
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Prometheus: metrics sent");
            }
            else
            {
                var responseText = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("Prometheus: {StatusCode}, {Response}", response.StatusCode, responseText);
            }
        }
    }

    private static TimeSeries CreateTimeSeries(string metric, List<(string name, string value)> labels, DateTime utcDateTime, double value)
    {
        var result = new TimeSeries();

        // name label is MUST HAVE
        result.Labels.Add(
          new Label
          {
              Name = "__name__",
              Value = metric
          });

        foreach (var l in labels)
        {
            result.Labels.Add(new Label
            {
                Name = l.name,
                Value = l.value
            });
        }

        result.Samples.Add(new Sample
        {
            Timestamp = utcDateTime.ToPrometheusTimestamp(),
            Value = value
        });

        return result;
    }
}