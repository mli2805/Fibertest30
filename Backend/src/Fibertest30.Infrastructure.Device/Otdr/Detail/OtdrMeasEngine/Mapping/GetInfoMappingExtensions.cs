using GrpcGetInfoResponse = Optixsoft.GrpcOtdr.GetInfoResponse;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class GetInfoMappingExtensions
{
    public static GetInfoResponse FromGrpc(this GrpcGetInfoResponse grpc)
    {
        return new GetInfoResponse(
            Version: grpc.HasVersion ? grpc.Version : string.Empty,
            Modules: grpc.Modules.Select(m => m.FromGrpc()).ToList());
    }

    private static ModuleInfo FromGrpc(this GrpcGetInfoResponse.Types.ModuleInfo grpc)
    {
        return new ModuleInfo(
            Name: grpc.HasName ? grpc.Name : string.Empty,
            Version: grpc.HasVersion ? grpc.Version : string.Empty);
    }
}
