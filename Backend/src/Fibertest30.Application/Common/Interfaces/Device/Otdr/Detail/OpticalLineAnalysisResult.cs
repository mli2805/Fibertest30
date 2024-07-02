namespace Fibertest30.Application;
public class OpticalLineAnalysisResult
{
    private OtdrConnectionQuality _otdrConnectionQuality = new OtdrConnectionQuality();
    public OtdrConnectionQuality OtdrConnectionQuality { get => _otdrConnectionQuality; }

    public int? LMax { get; set; }

    public double? Snr { get; set; }

    public int VscoutCount { get; set; }
}
