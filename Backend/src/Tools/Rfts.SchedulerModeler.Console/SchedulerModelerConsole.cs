using Fibertest30.Application;
using System.Diagnostics;

namespace Rfts.ConsoleSchedulerModeler;

public class SchedulerModelerConsole
{
    private static readonly int _printQueueSize = 1000;

    private static readonly Dictionary<int, ConsoleColor> _portColorMap = new()
    {
        { 1, ConsoleColor.Red },
        { 2, ConsoleColor.Green },
        { 3, ConsoleColor.Blue },
        { 4, ConsoleColor.Cyan },
        { 5, ConsoleColor.Magenta },
        { 6, ConsoleColor.Yellow },
        { 7, ConsoleColor.DarkRed },
        { 8, ConsoleColor.DarkGreen },
        { 9, ConsoleColor.DarkBlue },
        { 10, ConsoleColor.DarkCyan },
        { 11, ConsoleColor.DarkMagenta },
        { 12, ConsoleColor.DarkYellow },
    };

    private readonly string _portsModelFilePath;

    public SchedulerModelerConsole(string portsModelFilePath)
    {
        _portsModelFilePath = portsModelFilePath;
    }

    public void Run()
    {
        while (true)
        {
            try
            {
                RunOnce();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.ResetColor();
            }
        }
    }

    public void RunAuto(TimeSpan period)
    {
        try
        {
            var ports = LoadPortsFromFile(_portsModelFilePath);
            RunNormal(ports, period);
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex.Message);
            Console.ResetColor();
            Environment.Exit(1);
        }
    }
    
    private void RunOnce()
    {
        var mode = PromptMode();
        var ports = LoadPortsFromFile(_portsModelFilePath);
        if (mode == SchedulerModelerMode.Normal)
        {
            var period = PromptPeriod();
            RunNormal(ports, period);
        }
        else
        {
            PrintInteractiveUsage();
            Console.WriteLine();
            RunPredict(ports, TimeSpan.MaxValue, true);
        }

        Console.WriteLine();
    }
    
    private void RunNormal(List<ScheduledPort> ports, TimeSpan period)
    {
        var stopwatch = Stopwatch.StartNew();
        stopwatch.Start();
        var (scheduler, scheduledPorts) = RunPredict(ports, period, false);
        stopwatch.Stop();

        PrintScheduledPorts(scheduledPorts);
        PrintStatistics(scheduler, false);
        Console.WriteLine($"Modeling period: {period}{Environment.NewLine}" +
                          $"Modeling time: {stopwatch.Elapsed}{Environment.NewLine}" +
                          $"Total tests: {scheduledPorts.Count(x=> x.Port != null)}{Environment.NewLine}" +
                          $"v{typeof(SchedulerModelerConsole).Assembly.GetName().Version!.ToString(2)}");
    }

    private (MonitoringScheduler, List<ScheduledNext>) RunPredict(List<ScheduledPort> ports, TimeSpan modelerPeriod,
        bool interactive)
    {
        var scheduleHistory = new List<ScheduledNext>();
        var skipStepByStepCount = 0;
        var nextAndStatisticsMode = false;


        bool BeforeStart(MonitoringScheduler scheduler)
        {
            if (interactive)
            {
                (var quit, skipStepByStepCount, nextAndStatisticsMode) =
                    PromptStepByStep(scheduler, scheduleHistory);
                return quit;
            }

            return false;
        }

        bool OnNext(MonitoringScheduler scheduler, ScheduledNext next)
        {
            scheduleHistory.Add(next);
            
            if (next.Delay != null)
            {
                if (interactive && !nextAndStatisticsMode)
                {
                    Console.WriteLine($"--: delay till {next.Delay.NextScheduleAt:yyyy-MM-dd HH:mm:ss.fff}");
                }
                return false;
            }


            skipStepByStepCount--;

            if (interactive)
            {
                if (nextAndStatisticsMode)
                {
                    Console.Clear();
                    Console.WriteLine($"now: {scheduler.UtcNow:yyyy-MM-dd HH:mm:ss.fff}");
                    PrintScheduledPorts(scheduleHistory);
                    PrintStatistics(scheduler, true);
                    nextAndStatisticsMode = false;
                }
                else
                {
                    Console.Write($"{scheduleHistory.Count(x => x.Port != null)}: ");
                    ConsoleWriteColorizeByPortIndex(next.Port!.MonitoringPortId, $"{next.Port.MonitoringPortId}");
                    Console.Write(
                        $" at {next.Port.LastRun:yyyy-MM-dd HH:mm:ss.fff} {GetPortMode(next.Port)} {next.Port.LastRunBy.ToString()}");
                    Console.WriteLine();
                }

                if (skipStepByStepCount <= 0)
                {
                    (var quit, skipStepByStepCount, nextAndStatisticsMode) =
                        PromptStepByStep(scheduler, scheduleHistory);
                    return quit;
                }
            }

            return false;
        }

        var dateTime = new SchedulerModelerDateTime();
        var scheduler = SchedulerModeler.Run(dateTime, ports, modelerPeriod, BeforeStart, OnNext);
        return (scheduler, scheduleHistory);
    }


    private void PrintScheduledPorts(List<ScheduledNext> scheduleHistory)
    {
        Console.WriteLine();
        int counter = 0;
        foreach (var next in scheduleHistory)
        {
            if (next.Port != null)
            {
                ConsoleWriteColorizeByPortIndex(next.Port.MonitoringPortId, $"{next.Port.MonitoringPortId} ");
            }
            else
            {
                Console.Write($"- ");
            }
           
            
            counter++;
            if (counter >= _printQueueSize)
            {
                Console.Write(
                    $"... {_printQueueSize} displayed, {scheduleHistory.Count(x => x.Port != null) - counter} more hidden");
                break;
            }
        }

        Console.WriteLine();
    }

    private void ConsoleWriteColorizeByPortIndex(int portIndex, string message)
    {
        if (_portColorMap.TryGetValue(portIndex, out var value))
        {
            Console.ForegroundColor = value;
        }

        Console.Write(message);
        Console.ResetColor();
    }

    private void ConsoleWriteColor(ConsoleColor color, string message)
    {
        Console.ForegroundColor = color;
        Console.Write(message);
        Console.ResetColor();
    }

    private void PrintStatistics(MonitoringScheduler scheduler, bool printNextRun)
    {
        var ports = scheduler.GetPorts();
        
        Console.WriteLine();
        string format = "{0,-19} {1,-4} {2,-7} {3,-7} {4,-15}" + (printNextRun ? " {5,-25} " : " ")   + "{6,-9} {7,-12} {8,-8} {9,-8}";
        Console.WriteLine(format, "mode", "#", "test", "count", "total-test", printNextRun ? "next-run" : "", "interval", "average", "%", "time");

        foreach (var port in ports)
        {
            Console.Write($"{GetPortMode(port),-20}");
            ConsoleWriteColorizeByPortIndex(port.MonitoringPortId, $"{port.MonitoringPortId.ToString(),-5}");
            Console.Write($"{TimeSpanToString(port.TestTime),-8}");
            Console.Write($"{port.Statistics.RunCount.ToString(),-8}");
            Console.Write($"{TimeSpanToString(port.Statistics.RunCount * port.TestTime),-16}");
            if (printNextRun)
            {
                Console.Write($"{port.NextRun,-26:yyyy-MM-dd HH:mm:ss.fff}");
            }
            var period = GetInterval(port).HasValue  ? $"{TimeSpanToString(GetInterval(port)!.Value)}" : "";
            Console.Write($"{period,-10}");

            if (port is not FixedTimeSlotPort)
            {
                Console.Write($"{TimeSpanToString(port.Statistics.TimesBetweenRuns.Average),-13}");
            }
            else
            {
                Console.Write($"{"",-13}");
            }

            if (port.Statistics.TimesBetweenRuns.Average != TimeSpan.Zero
                && port is AtLeastOnceInPort)
            {
                var interval = GetInterval(port)!.Value;

                var difference = interval - port.Statistics.TimesBetweenRuns.Average;
                var percent = 100 * difference / interval;

                var closeToZero = Math.Abs(percent) < 1;
                var percentStr = $"{Math.Abs(percent):00.00;00.00}%".PadRight(9);

                if (closeToZero)
                {
                    Console.Write(percentStr);
                }
                else
                {
                    var color = Console.ForegroundColor;
                    if (port is AtLeastOnceInPort)
                    {
                        color = percent > 0 ? ConsoleColor.Green : ConsoleColor.Red;
                    }

                    ConsoleWriteColor(color, $"{percentStr}");
                    ConsoleWriteColor(color, $"{TimeSpanToString(difference),-9}");
                }
            }

            if (port.Statistics.RunCount == 0)
            {
                ConsoleWriteColor(ConsoleColor.Red, "DEAD ");
            }

            Console.WriteLine();
        }
        
        PrintTotalTime(scheduler, ports);

        Console.WriteLine();
    }

    private static void PrintTotalTime(MonitoringScheduler scheduler, List<ScheduledPort> ports)
    {
        Console.WriteLine();
        
        var totalTime = scheduler.UtcNow - SchedulerModelerDateTime.InitialTime;
        Console.Write($"TotalTime: {TimeSpanToString(totalTime)}");

        // var totalTestTime = TimeSpan.Zero;
        // ports.ForEach(x => { totalTestTime += x.TestTime * x.Statistics.RunCount; });
        // var delay = totalTime - totalTestTime;
        //
        //
        // Console.Write($"TotalTime: {TimeSpanToString(totalTime)}  TestsTime: {TimeSpanToString(totalTestTime)}  IdleTime: {TimeSpanToString(delay)}");
        // if (totalTime != TimeSpan.Zero)
        // {
        //     var percent = 100 * delay / totalTime;
        //     Console.Write($" ({percent:00.00}%)");
        // }
        
        Console.WriteLine();
        
    }

    private TimeSpan? GetInterval(ScheduledPort port)
    {
        return (port as AtLeastOnceInPort)?.Interval;
    }

    private void PrintInteractiveUsage()
    {
        Console.WriteLine(
            "Interactive: 'space' next, 'enter' next & statistics, 'n' next-100, 's' statistics, 'q' quit");
    }

    private (bool, int, bool) PromptStepByStep(MonitoringScheduler scheduler, List<ScheduledNext> scheduleHistory)
    {
        while (true)
        {
            var key = Console.ReadKey(true);
            switch (key.Key)
            {
                case ConsoleKey.Spacebar:
                    {
                        return (false, 0, false);
                    }
                case ConsoleKey.Q:
                    {
                        return (true, 0, false);
                    }
                case ConsoleKey.Enter:
                    {
                        return (false, 0, true);
                    }
                case ConsoleKey.N:
                    {
                        return (false, 100, false);
                    }
                case ConsoleKey.S:
                    {
                        PrintScheduledPorts(scheduleHistory);
                        PrintStatistics(scheduler, true);
                        break;
                    }
                default:
                    {
                        PrintInteractiveUsage();
                        break;
                    }
            }
        }
    }

    private SchedulerModelerMode PromptMode()
    {
        while (true)
        {
            Console.Write("Select mode: 'n' normal, 'i' interactive, 'c' clear, 'q' quit: [n]");
            var key = Console.ReadKey();
            Console.WriteLine();
            switch (key.Key)
            {
                case ConsoleKey.C:
                    {
                        Console.Clear();
                        break;
                    }
                case ConsoleKey.Enter:
                case ConsoleKey.N:
                    {
                        return SchedulerModelerMode.Normal;
                    }
                case ConsoleKey.I:
                    {
                        return SchedulerModelerMode.Interactive;
                    }
                case ConsoleKey.Q:
                    {
                        Console.WriteLine("Done!");
                        Environment.Exit(0);
                        break;
                    }
            }
        }
    }

    private TimeSpan PromptPeriod()
    {
        while (true)
        {
            Console.Write("Select period: 'h' hour, 'd' day, 'w' week, 'm' month, 'y' year [m]: ");
            var key = Console.ReadKey();
            Console.WriteLine();
            switch (key.Key)
            {
                case ConsoleKey.H:
                    {
                        return TimeSpan.FromHours(1);
                    }
                case ConsoleKey.D:
                    {
                        return TimeSpan.FromDays(1);
                    }
                case ConsoleKey.W:
                    {
                        return TimeSpan.FromDays(7);
                    }
                case ConsoleKey.Enter:
                case ConsoleKey.M:
                    {
                        return TimeSpan.FromDays(30);
                    }
                case ConsoleKey.Y:
                    {
                        return TimeSpan.FromDays(365);
                    }
            }
        }
    }

    private string GetPortMode(ScheduledPort port)
    {
        switch (port)
        {
            case AtLeastOnceInPort:
                return "at-least-once-in";
            case FixedTimeSlotPort:
                return "fixed-time-slot";
            case RoundRobinPort:
                return "round-robin";
            default:
                throw new ArgumentOutOfRangeException(nameof(port));
        }
    }

    private static List<ScheduledPort> LoadPortsFromFile(string filePath)
    {
        var lines = File.ReadAllLines(filePath)
            .Where(line => !string.IsNullOrWhiteSpace(line) && !line.TrimStart().StartsWith("#"))
            .ToList();

        var ports = new List<ScheduledPort>();
        foreach (var line in lines)
        {
            var parts = line.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

            var portIndex = int.Parse(parts[0].Trim());
            var mode = parts[1].ToLowerInvariant().Trim();
            TimeSpan testTime = parts[2].Trim().ParseTimeSpan();

            switch (mode)
            {
                case "at-least-once-in":
                    var atLeastOnceIn = parts[3].ParseTimeSpan();
                    ports.Add(new AtLeastOnceInPort(portIndex, testTime, atLeastOnceIn));
                    break;
                case "fixed-time-slot":
                    var timeSlots = new List<TimeSlot>();
                    for (int i = 3; i < parts.Length; i++)
                    {
                        timeSlots.Add(TimeSlot.Parse(parts[i]));
                    }

                    ports.Add(new FixedTimeSlotPort(portIndex, testTime, timeSlots));
                    break;
                case "round-robin":
                    ports.Add(new RoundRobinPort(portIndex, testTime));
                    break;
            }
        }

        return ports;
    }



    private static string TimeSpanToString(TimeSpan timeSpan)
    {
        var result = string.Empty;

        if (timeSpan == TimeSpan.Zero)
        {
            return "0";
        }

        if (timeSpan.Days != 0) { result += $"{Math.Abs(timeSpan.Days)}d "; }

        if (timeSpan.Hours != 0) { result += $"{Math.Abs(timeSpan.Hours)}h "; }

        if (timeSpan.Minutes != 0) { result += $"{Math.Abs(timeSpan.Minutes)}m "; }

        if (timeSpan.Seconds != 0) { result += $"{Math.Abs(timeSpan.Seconds)}s "; }

        return result.TrimEnd(' ');
    }
}