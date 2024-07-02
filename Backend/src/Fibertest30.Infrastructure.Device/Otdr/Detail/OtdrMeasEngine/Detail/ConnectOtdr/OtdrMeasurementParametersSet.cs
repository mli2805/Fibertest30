namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public record DistanceRangeSet(
    List<string> PulseDurations,
    List<string> AveragingTimes,
    List<string> LiveAveragingTimes,
    List<string> Resolutions);

public record LaserUnitSet(
    Dictionary<string, DistanceRangeSet> DistanceRanges,
    List<string> DwdmChannels,
    string? Connector);

public record OtdrMeasurementParameterSet(Dictionary<string, LaserUnitSet> LaserUnits);
