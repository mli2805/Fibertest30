namespace Fibertest30.Application;

public interface IPrometheusQueryStringBuilder
{
    string Build(string metric, int portId, string timeRange);
}