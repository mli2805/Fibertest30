namespace Fibertest30.Application;
public class OtdrTraceManualMeasurementParameters
{
    public Laser Laser { get; set; }

    public string? DistanceRange { get; set; }
    public double? CustomDistanceRange { get; set; }

    public string? PulseDuration { get; set; }
    public double? CustomPulseDuration { get; set; }

    public string? AveragingTime { get; set; }
    public string? LiveAveragingTime { get; set; }

    public string? Resolution { get; set; }

    public bool PreferDZOverDR { get; set; }

    public int? MaxPointCountForIntermediateTrace { get; set; }
}
