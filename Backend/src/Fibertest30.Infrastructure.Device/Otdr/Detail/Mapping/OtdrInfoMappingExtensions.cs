namespace Fibertest30.Infrastructure.Device;
public static class OtdrInfoMappingExtensions
{
    public static OtdrProductInfo FromEngine(this OtdrMeasEngine.OtdrInfo engine)
    {
        return new()
        {
            MainframeId = engine.MainframeId,
            OpticalModuleSerialNumber = engine.OpticalModuleSerialNumber
        };
    }

    public static Application.OtdrMeasurementParameterSet FromEngine(
        this OtdrMeasEngine.OtdrMeasurementParameterSet engine)
    {
        return new()
        {
            LaserUnits = engine.LaserUnits.ToDictionary(lu => lu.Key, lu => lu.Value.FromEngine())
        };
    }

    private static Application.OtdrMeasurementParameterSet.LaserUnitSet FromEngine(
        this OtdrMeasEngine.LaserUnitSet engine)
    {
        return new()
        {
            DistanceRanges = engine.DistanceRanges.ToDictionary(dr => dr.Key, dr => dr.Value.FromEngine()),
            DwdmChannels = engine.DwdmChannels,
            Connector = engine.Connector
        };
    }

    private static Application.OtdrMeasurementParameterSet.LaserUnitSet.DistanceRangeSet FromEngine(
        this OtdrMeasEngine.DistanceRangeSet engine)
    {
        return new()
        {
            AveragingTimes = engine.AveragingTimes,
            LiveAveragingTimes = engine.LiveAveragingTimes,
            PulseDurations = engine.PulseDurations,
            Resolutions = engine.Resolutions
        };
    }
}