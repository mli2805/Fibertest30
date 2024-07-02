namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public record AnalyseOpticalLineResponse(
    double? Reflectance, 
    double? Loss,
    int? LmaxNs,
    double? Snr);
