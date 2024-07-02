using System.Text.Json.Serialization;

namespace Fibertest30.Domain;

public enum MeasurementType
{ 
    Manual,
    Auto,
    AutoSkipMeasurement,
}
public enum NetworkType
{
    PointToPoint,
    ManualPon,
    AutoPon,
    XWdm,
    AutoPonToOnt
}

public class MeasurementSettings
{
    public MeasurementType MeasurementType { get; set; }
    public NetworkType NetworkType { get; set; }
    public double BackscatterCoeff { get; set; }
    public double RefractiveIndex { get; set; }
    public string Laser { get; set; } = string.Empty;
    public string DistanceRange { get; set; } = string.Empty;
    public string AveragingTime { get; set; } = string.Empty;
    public string Pulse { get; set; } = string.Empty;
    public string SamplingResolution { get; set; } = string.Empty;
    public double EventLossThreshold { get; set; }
    public double EventReflectanceThreshold { get; set; }
    public double EndOfFiberThreshold { get; set; }
    public bool FastMeasurement { get; set; }
    public bool CheckConnectionQuality { get; set; }
    
    public double Splitter1Db { get; set; }
    
    public double Splitter2Db { get; set; }
    
    public int Mux { get; set; }

    [JsonIgnore]
    public byte[]? Baseline { get; set; }
}