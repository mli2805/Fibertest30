using GrpcApplyVscoutTraceAcquisitionParametersResponse = Optixsoft.GrpcOtdr.ApplyVscoutTraceAcquisitionParametersResponse;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class ApplyVscoutTraceAcquisitionParametersResponseMappingExtensions
{
    public static ApplyVscoutTraceAcquisitionParametersResponse FromGrpc(
        this GrpcApplyVscoutTraceAcquisitionParametersResponse grpc)
    {
        return new ApplyVscoutTraceAcquisitionParametersResponse(VscoutApplied: grpc.VscoutApplied);
    }
}
