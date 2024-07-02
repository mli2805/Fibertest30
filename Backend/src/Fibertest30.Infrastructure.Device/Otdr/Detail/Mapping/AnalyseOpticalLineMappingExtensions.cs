namespace Fibertest30.Infrastructure.Device;

public static class AnalyseOpticalLineMappingExtensions
{
    public static OtdrMeasEngine.Laser ToEngine(this Laser native)
    {
        return new OtdrMeasEngine.Laser(
            LaserUnit: native.LaserUnit,
            DwdmChannel: native.DwdmChannel ?? String.Empty);
    }

    public static OpticalLineAnalysisResult FromEngine(

        this OtdrMeasEngine.AnalyseOpticalLineResponse engine)
    {
        var result = new OpticalLineAnalysisResult();
        result.OtdrConnectionQuality.Reflectance = engine.Reflectance;
        result.OtdrConnectionQuality.Loss = engine.Loss;
        result.LMax = engine.LmaxNs;
        result.Snr = engine.Snr;
        return result;
    }
}
