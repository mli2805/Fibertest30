namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public class AdvancedThresholds
{
    public double? AttenuationCoefficientChangeForNewEvents { get; set; }
    public double? EofLossChangeForFiberBreak { get; set;}
    public double? EofAtenuationCoefficientChangeForFiberBreak { get; set;}
    public double? MaxEofAtenuationCoefficientForFiberBreak { get; set;}
    public double? NoiseLevelChangeForFiberElongation { get; set;}
}
