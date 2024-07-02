namespace Fibertest30.Application;

public enum LineKind { PointToPoint, Pon, PonToOnt }

public class OpticalLineTopology
{
    public LineKind LineKind { get; set; } = LineKind.PointToPoint;

    private readonly List<double> _elemenetLosses = new List<double>();
    public List<double> ElemenetLosses { get => _elemenetLosses; }
}
