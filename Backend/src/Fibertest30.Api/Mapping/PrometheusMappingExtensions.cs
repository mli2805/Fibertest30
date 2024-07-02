namespace Fibertest30.Api;

public static class PrometheusMappingExtensions
{
    public static DataPoint ToProto(this Application.DataPoint dataPoint)
    {
        return new DataPoint
        {
            X = dataPoint.X.ToTimestamp(),
            Y = dataPoint.Y
        };
    }

    public static CumulativeMetric ToProto(this Application.CumulativeMetric metric)
    {
        return new CumulativeMetric
        {
            Wavelength = metric.Wavelength,
            DataPoints = { metric.DataPoints?.Select(dp => dp.ToProto()) ?? Array.Empty<DataPoint>() }
        };
    }

    public static FiberSectionMetric ToProto(this Application.FiberSectionMetric metric)
    {
        return new FiberSectionMetric
        {
            Wavelength = metric.Wavelength,
            Index = metric.Index,
            DataPoints = { metric.DataPoints?.Select(dp => dp.ToProto()) ?? Array.Empty<DataPoint>() }
        };
    }

    public static FiberEventMetric ToProto(this Application.FiberEventMetric metric)
    {
        return new FiberEventMetric
        {
            Wavelength = metric.Wavelength,
            Index = metric.Index,
            DataPoints = { metric.DataPoints?.Select(dp => dp.ToProto()) ?? Array.Empty<DataPoint>() }
        };
    }
}