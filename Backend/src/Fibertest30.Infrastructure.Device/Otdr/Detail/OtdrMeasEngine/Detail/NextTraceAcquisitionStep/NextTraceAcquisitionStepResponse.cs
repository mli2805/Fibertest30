namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public record NextTraceAcquisitionStepResponse(bool Finished, double? Progress, byte[]? Trace);
