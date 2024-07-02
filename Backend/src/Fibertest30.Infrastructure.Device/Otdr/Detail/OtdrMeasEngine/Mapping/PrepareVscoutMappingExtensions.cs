using GrpcPrepareVscoutRequest = Optixsoft.GrpcOtdr.PrepareVscoutRequest;
using GrpcPrepareVscoutResponse = Optixsoft.GrpcOtdr.PrepareVscoutResponse;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class PrepareVscoutMappingExtensions
{
    public static GrpcPrepareVscoutRequest ToGrpc(this PrepareVscoutRequest native)
    {
        return new GrpcPrepareVscoutRequest() { ForceSingleTraceAcquisition = native.ForceSingleTraceAquisition };
    }

    public static PrepareVscoutResponse FromGrpc(this GrpcPrepareVscoutResponse grpc)
    {
        return new PrepareVscoutResponse(VscoutCount: grpc.VscoutCount);
    }
}
