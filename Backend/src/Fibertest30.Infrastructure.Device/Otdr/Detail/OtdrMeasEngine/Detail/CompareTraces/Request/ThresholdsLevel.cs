namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public class ThresholdsLevel
{
    public string Name { get; set; } = "";

    public Thresholds Thresholds { get; set; } = new Thresholds();

    public AdvancedThresholds AdvancedThresholds { get; set;} = new AdvancedThresholds();
}
