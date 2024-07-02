namespace Fibertest30.Application;
public class OtdrMeasurementParameterSet
{
    public class LaserUnitSet
    {
        public class DistanceRangeSet
        {
            public List<string> PulseDurations { get; init; } = new();
            public List<string> AveragingTimes { get; init; } = new();
            public List<string> LiveAveragingTimes { get; init; } = new();
            public List<string> Resolutions { get; init; } = new();
        }

        public Dictionary<string, DistanceRangeSet> DistanceRanges { get; init; } = new();
        public List<string> DwdmChannels { get; init; } = new();
        public string? Connector { get; set; }
    }

    public Dictionary<string, LaserUnitSet> LaserUnits { get; init; } = new();

    public string GetFirstLaserName()
    {
        return LaserUnits.Keys.First();
    }
    
    public (string, LaserUnitSet) GetFirstLaser()
    {
        var pair = LaserUnits.First();
        return (pair.Key, pair.Value);
    }
    
    public LaserUnitSet GetLaserByName(string laserName)
    {
        var pair = LaserUnits.FirstOrDefault(x => x.Key == laserName);
        return pair.Value;
    }
}
