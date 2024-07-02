namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public record StartTraceAcquisitionRequest(
    bool IsLiveMode, bool ReturnInitialTrace, int? MaxIntermediateTracePointsCount, bool ForcePhotodiodeTuning);
