namespace Fibertest30.Database.Cli;

public class MonitoringPortPeriod
{
    public int Port { get; set; }
    public TimeSpan Period { get; set; }

    public int Count { get; set; } = 0;
}