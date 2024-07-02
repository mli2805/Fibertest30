namespace Rfts.ConsoleSchedulerModeler;

public static class TimeSpanExtension
{
    public static TimeSpan ParseTimeSpan(this string input)
    {
        var coeff = new Dictionary<string, int>
        {
            { "s", 1 },
            { "m", 60 },
            { "h", 3600 },
            { "d", 3600 * 24 },
            { "w", 3600 * 24 * 7 },
            { "mo", 3600 * 24 * 30 },
            { "y", 3600 * 24 * 365 }
        };

        var unit = coeff.Keys.FirstOrDefault(x => input.EndsWith(x));
        if (unit == null)
        {
            throw new FormatException($"Invalid time format: {input}");
        }

        var inputValue = double.Parse(input.Substring(0, input.Length - unit.Length));
        return TimeSpan.FromSeconds(inputValue * coeff[unit]);
    }
}