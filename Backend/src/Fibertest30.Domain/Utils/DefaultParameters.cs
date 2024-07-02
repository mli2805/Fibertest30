namespace Fibertest30.Domain.Utils;

public static class DefaultParameters 
{
    public static double RefractiveIndex { get; } = 1.4682;
    public static double RefractiveIndexMin { get; } = 1.2;
    public static double RefractiveIndexMax { get; } = 2;
    

    public static double BackscatteringCoeff { get; } = -81;
    public static double BackscatteringCoeffMin { get; } = -90;
    public static double BackscatteringCoeffMax { get; } = -50;
    
    public static double EventLossThreshold { get; } = 0.3;
    public static double EventLossThresholdMin { get; } = 0.05;
    public static double EventLossThresholdMax { get; } = 30;
    
    
    public static double EventReflectanceThreshold { get; } = -60;
    public static double EventReflectanceThresholdMin { get; } = -65;
    public static double EventReflectanceThresholdMax { get; } = -14;

    public static double EndOfFiberThreshold { get; } = 3;
    public static double EndOfFiberThresholdMin { get; }= 1;
    public static double EndOfFiberThresholdMax { get; } = 50;
    public static double MuxDb { get; } = 3;
}
