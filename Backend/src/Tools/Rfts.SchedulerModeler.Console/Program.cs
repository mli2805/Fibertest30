


using Rfts.ConsoleSchedulerModeler;

string Usage = @"
Usage: 
       rfts-scheduler [--port-config-file <file> (default: ports-model.txt)] [--period <duration>]
       
       If --period is omitted, starts in user mode.
       
       Duration should be one of the following time units:
       - s (seconds)
       - m (minutes)
       - h (hours)
       - d (days)
       - w (weeks)
       - mo (months)
       - y (years)

Example: 
       rfts-scheduler --port-config-file custom-ports.txt --period 10d

";

try
{
    var cmd = new CommandLine(args);
    var portConfigFile = cmd.GetValue("--port-config-file", "ports-model.txt");
    var period = cmd.GetValue("--period", string.Empty);
    var help = cmd.GetFlag("--help") || cmd.GetFlag("-h");

    if (help || cmd.HasAnyArgument())
    {
        Console.WriteLine(Usage);
        return;
    }
   
    var portsModelFilePath = Path.Combine(Directory.GetCurrentDirectory(), portConfigFile);
    var schedulerModeler = new SchedulerModelerConsole(portsModelFilePath);
    if (period == string.Empty)
    {
        schedulerModeler.Run();
    }
    else
    {
        schedulerModeler.RunAuto(period.ParseTimeSpan());
    }
    
}
catch (Exception ex)
{
    Console.WriteLine(ex);
}
