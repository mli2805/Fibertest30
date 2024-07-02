namespace Fibertest30.Application;

public class AlarmProfile
{
    public int Id { get; init; }

    public string Name { get; set; } = null!;

    public List<Threshold> Thresholds { get; set; } = null!;
}