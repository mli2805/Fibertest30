using Rfts.ConsoleSchedulerModeler;

namespace Fibertest30.Database.Cli;

public static class OptionParser
{
    public static DatabaseCreationOptions ParseCreate(CommandLine cmd)
    {
        var databaseOutputPath = cmd.GetValue("--output", "rfts400.db");
        var measurementTime = cmd.GetValue("--measurement-time", "5s");
        var seedDemoUsers = cmd.GetFlag("--seed-demo-users");
        var sor = cmd.GetFlag("--sor");
        var analyze = cmd.GetFlag("--analyze");
        var batchSize = cmd.GetValue("--batch-size", 1000);
        
        var monitoringPortPeriodsStr = cmd.GetValueList("--monitoring");
        var monitoringPortPeriods = GetMonitoringPortPeriods(monitoringPortPeriodsStr);

        if (monitoringPortPeriods.Any(x => x.Port is < 1 or > 8))
        {
            throw new Exception("Port must be between 1 and 8.");
        }

        var options = new DatabaseCreationOptions
        {
            DatabaseOutputPath = databaseOutputPath, 
            MonitoringPortPeriodsStr = monitoringPortPeriodsStr,
            MonitoringPortPeriods = monitoringPortPeriods,
            MeasurementTime = measurementTime.ParseTimeSpan(),
            SeedDemoUsers = seedDemoUsers,
            AddSor = sor,
            Analyze = analyze,
            BatchSize = batchSize
        };

        return options;
    }

    private static List<MonitoringPortPeriod> GetMonitoringPortPeriods(List<string> monitoringPortPeriodsStr)
    {
        return monitoringPortPeriodsStr.Select(portPeriod =>
            {
                var portPeriodParts = portPeriod.Split(':');
                if (portPeriodParts.Length != 2)
                {
                    throw new Exception($"Invalid monitoring port format: {portPeriodParts}");
                }

                return new MonitoringPortPeriod
                {
                    Port = int.Parse(portPeriodParts[0]),
                    Period = portPeriodParts[1].ParseTimeSpan()
                };
            }
        ).ToList();
    }
}