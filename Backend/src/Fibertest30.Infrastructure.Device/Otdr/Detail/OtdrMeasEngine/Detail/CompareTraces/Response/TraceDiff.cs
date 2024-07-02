namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public class TraceDiff
{
    public List<ChangesLevel> Levels { get; init; } = new List<ChangesLevel>();

    public bool Empty() => Levels.All(l => l.Empty());
}
