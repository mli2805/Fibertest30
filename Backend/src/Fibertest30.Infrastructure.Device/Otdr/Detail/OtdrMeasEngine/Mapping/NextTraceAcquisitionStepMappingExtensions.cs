using GrpcNextTraceAcquisitionStepRequest = Optixsoft.GrpcOtdr.NextTraceAcquisitionStepRequest;
using GrpcNextTraceAcquisitionStepResponse = Optixsoft.GrpcOtdr.NextTraceAcquisitionStepResponse;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class NextTraceAcquisitionStepMappingExtensions
{
    public static GrpcNextTraceAcquisitionStepRequest ToGrpc(this NextTraceAcquisitionStepRequest native)
    {
        return new()
        {
            ReturnIntermediateTrace = native.ReturnIntermediateTrace,
            ReturnFinalTrace = native.ReturnFinalTrace
        };
    }

    public static NextTraceAcquisitionStepResponse FromGrpc(this GrpcNextTraceAcquisitionStepResponse grpc)
    {
        return new NextTraceAcquisitionStepResponse(
            Finished: grpc.Finished,
            Progress: grpc.HasProgress ? grpc.Progress : null,
            Trace: grpc.HasTrace ? grpc.Trace.ToByteArray() : null);
    }
}
