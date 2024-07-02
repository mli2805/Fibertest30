namespace Fibertest30.Infrastructure.Device;

public static class LineTopologyMappingExtensions
{
    public static OtdrMeasEngine.OpticalLineProperties ToEngine(this OpticalLineTopology native)
    {
        return new OtdrMeasEngine.OpticalLineProperties(
            OpticalLineKind: native.LineKind.ToEngine(),
            SplitterRatios: native.ElemenetLosses.Select(l => l.SplitterLossToRatio()).ToList());
    }

    private static OtdrMeasEngine.OpticalLineKind ToEngine(this LineKind native)
    {
        return native switch
        {
            LineKind.PointToPoint => OtdrMeasEngine.OpticalLineKind.PointToPoint,
            LineKind.Pon => OtdrMeasEngine.OpticalLineKind.Pon,
            LineKind.PonToOnt => OtdrMeasEngine.OpticalLineKind.PonToOnt,
            _ => throw new ArgumentOutOfRangeException($"Unsupported value of LineKind: {native}")
        };
    }

    private static int SplitterLossToRatio(this double loss)
    {
        var closestSplitter = TypicalSplitters.MinBy(ps => Math.Abs(ps.OneWayLoss - loss));
        return closestSplitter.Ratio;
    }

    private readonly record struct PonSplitter(int Ratio, double OneWayLoss);
    private static readonly List<PonSplitter> TypicalSplitters = new List<PonSplitter>()
    {
        // The values below taken from RFTS300, then RTU4000 projects, and originally from PPT from Nitish.
        new(Ratio: 1, OneWayLoss: 0.0),
        new(Ratio: 2, OneWayLoss: 3.4),
        new(Ratio: 4, OneWayLoss: 7.0),
        new(Ratio: 8, OneWayLoss: 10.6),
        new(Ratio: 16, OneWayLoss: 14.0),
        new(Ratio: 32, OneWayLoss: 17),
        new(Ratio: 64, OneWayLoss: 20),
        new(Ratio: 128, OneWayLoss: 25)
    };
}
