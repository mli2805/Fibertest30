namespace Fibertest30.Database.Cli;

public static class ConsoleUtils
{
    public static string ToElapsedString(this long elapsedMs)
    {
        return TimeSpan.FromMilliseconds(elapsedMs).ToElapsedString();
    }

    public static string ToElapsedString(this TimeSpan timeSpan)
    {
        return "in " + timeSpan.ToString(@"hh'h 'mm'm 'ss's'");
    }
}