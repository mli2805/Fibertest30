namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public class GenerateLinkmapRequest
{
    public List<byte[]> Sors { get; init; } = new List<byte[]>();

    public double? MacrobendThreshold { get; set; }
}
