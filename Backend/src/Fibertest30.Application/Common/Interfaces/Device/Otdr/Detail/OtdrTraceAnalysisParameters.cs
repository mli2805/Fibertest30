namespace Fibertest30.Application;
public class OtdrTraceAnalysisParameters 
{
    public double EventLossThreshold { get; set; } = 0.02;

    public double EventReflectanceThreshold { get; set; } = -65.0;

    public double EndOfFiberThreshold { get; set; } = 25.0;
}
