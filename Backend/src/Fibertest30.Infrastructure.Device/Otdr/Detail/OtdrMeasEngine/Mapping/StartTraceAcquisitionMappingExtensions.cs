using GrpcStartTraceAcquisitionRequest = Optixsoft.GrpcOtdr.StartTraceAcquisitionRequest;
using GrpcStartTraceAcquisitionResponse = Optixsoft.GrpcOtdr.StartTraceAcquisitionResponse;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class StartTraceAcquisitionMappingExtensions
{
    public static GrpcStartTraceAcquisitionRequest ToGrpc(this StartTraceAcquisitionRequest native)
    {
        var grpc = new GrpcStartTraceAcquisitionRequest()
        {
            Mode = native.IsLiveMode ? GrpcStartTraceAcquisitionRequest.Types.Mode.Live : 
                                       GrpcStartTraceAcquisitionRequest.Types.Mode.Normal,
            ReturnInitialTrace = native.ReturnInitialTrace,
            ForcePhotodiodeTuning = native.ForcePhotodiodeTuning
        };
        if (native.MaxIntermediateTracePointsCount.HasValue)
        {
            grpc.MaxIntermediateTracePointsCount = native.MaxIntermediateTracePointsCount.Value;
        }
        return grpc;
    }

    public static StartTraceAcquisitionResponse FromGrpc(this GrpcStartTraceAcquisitionResponse grpc)
    {
        return new StartTraceAcquisitionResponse(Trace: grpc.HasTrace ? grpc.Trace.ToByteArray() : null);
    }
}
