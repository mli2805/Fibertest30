namespace Fibertest30.Application;

public class OtauDiscover
{
    public string SerialNumber { get;init; } = string.Empty;
    public int PortCount { get; init; }
}

public enum OtauDiscoverError
{
    NoError,
    OsmModuleNotFound,
    UnsupportedOsmModuleConnected,
}

public class OtauDiscoverResult
{
    public OtauDiscover? Discover { get; set; }
    public OtauDiscoverError Error { get; set; } = OtauDiscoverError.NoError;
}