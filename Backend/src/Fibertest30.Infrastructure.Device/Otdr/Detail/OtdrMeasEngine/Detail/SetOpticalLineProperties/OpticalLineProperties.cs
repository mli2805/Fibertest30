namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public enum OpticalLineKind { Unspecified, PointToPoint, Pon, PonToOnt };

public record OpticalLineProperties(OpticalLineKind OpticalLineKind, List<int> SplitterRatios);
