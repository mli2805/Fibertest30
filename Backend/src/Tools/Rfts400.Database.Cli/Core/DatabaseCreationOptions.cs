namespace Fibertest30.Database.Cli;

public class DatabaseCreationOptions
{
    public string DatabaseOutputPath { get; set; } = null!;
    public List<MonitoringPortPeriod> MonitoringPortPeriods { get; set; } = null!;
    public List<string> MonitoringPortPeriodsStr { get; set; } = null!;
    public bool AddSor { get; set; }
    public bool SeedDemoUsers { get; set; }
    public bool Analyze { get; set; }
    public int BatchSize { get; set; }
    public TimeSpan MeasurementTime { get; set; } = TimeSpan.FromSeconds(5);
}