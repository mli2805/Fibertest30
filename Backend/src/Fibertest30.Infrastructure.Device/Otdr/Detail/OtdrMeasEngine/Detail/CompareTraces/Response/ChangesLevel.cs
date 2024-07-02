namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public class ChangesLevel
{
    public string LevelName { get; init; } = "";

    public List<Change> Changes { get; init; } = new List<Change>();

    public bool Empty() => Changes.Count == 0;
}