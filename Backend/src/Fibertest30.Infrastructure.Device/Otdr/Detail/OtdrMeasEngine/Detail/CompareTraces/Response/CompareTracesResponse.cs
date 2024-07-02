namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public class CompareTracesResponse
{
    public TraceDiff TraceDiff { get; init; } = new TraceDiff();
    public byte[] CurrentTrace { get; init; } = new byte[0];
    public string Log { get; init; } = "";
}
