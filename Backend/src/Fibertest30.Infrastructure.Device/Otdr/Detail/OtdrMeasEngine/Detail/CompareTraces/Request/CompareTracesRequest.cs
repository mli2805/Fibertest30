namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public class CompareTracesRequest
{
    public byte[] ReferenceTrace { get; set; } = new byte[0];
    public byte[] CurrentTrace { get; set; } = new byte[0];
    public List<ThresholdsLevel> ThresholdsLevels { get; init; } = new List<ThresholdsLevel>();
}
