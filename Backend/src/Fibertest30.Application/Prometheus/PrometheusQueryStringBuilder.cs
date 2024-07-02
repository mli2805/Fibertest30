namespace Fibertest30.Application;

public class PrometheusQueryStringBuilder : IPrometheusQueryStringBuilder
{
    private readonly IDateTime _dateTime;

    public PrometheusQueryStringBuilder(IDateTime dateTime)
    {
        _dateTime = dateTime;
    }

    public string Build(string metric, int portId, string timeRange)
    {
        var utcNow = _dateTime.UtcNow;
        var end = utcNow;
        var start = utcNow;

        //if (timeRange == "1h")
        //{
            return $"query?query={metric}{{monitoring_port_id=\"{portId}\"}}[{timeRange}]&time={end.ToPrometheusTimestampSeconds()}";
        //}

        //var step = "5m";
        //if (timeRange == "2h")
        //{
        //    start = utcNow.AddHours(-2);
        //    step = "30";
        //}
        //else if (timeRange == "4h")
        //{
        //    start = utcNow.AddHours(-4);
        //    step = "1m";
        //}
        //else if (timeRange == "12h")
        //{
        //    start = utcNow.AddHours(-12);
        //    step = "2m";
        //}
        //else if (timeRange == "1d")
        //{
        //    start = utcNow.AddDays(-1);
        //    step = "5m";
        //}
        //else if (timeRange == "7d")
        //{
        //    start = utcNow.AddDays(-7);
        //    step = "10m";
        //}
        //else if (timeRange == "30d")
        //{
        //    start = utcNow.AddDays(-30);
        //    step = "15m";
        //}
        //return $"query_range?query={metric}{{monitoring_port_id=\"{portId}\"}}&start={start.ToPrometheusTimestampSeconds()}&end={end.ToPrometheusTimestampSeconds()}&step={step}";
    }
}