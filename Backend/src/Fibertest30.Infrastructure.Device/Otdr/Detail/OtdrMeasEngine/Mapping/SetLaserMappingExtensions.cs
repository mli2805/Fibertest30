using GrpcSetLaserRequest = Optixsoft.GrpcOtdr.SetLaserRequest;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class SetLaserMappingExtensions
{
    public static GrpcSetLaserRequest ToGrpc(this Laser native)
    {
        var grpc = new GrpcSetLaserRequest()
        {
            LaserUnit = native.LaserUnit
        };
        if (!string.IsNullOrEmpty(native.DwdmChannel))
        {
            grpc.DwdmChannel = native.DwdmChannel;
        }
        return grpc;
    }
}
