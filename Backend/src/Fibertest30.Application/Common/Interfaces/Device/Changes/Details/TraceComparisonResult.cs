namespace Fibertest30.Application;

public class TraceComparisonResult
{
    public List<MonitoringChange> Changes { get; init; } = new List<MonitoringChange>();

    public byte[] ModifiedTrace { get; init; } = new byte[0];
}
