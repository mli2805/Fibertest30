using GrpcSetOpticalLinePropertiesRequest = Optixsoft.GrpcOtdr.SetOpticalLinePropertiesRequest;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class SetOpticalLinePropertiesMappingExtensions
{
    public static GrpcSetOpticalLinePropertiesRequest ToGrpc(this OpticalLineProperties native)
    {
        var grpc = new GrpcSetOpticalLinePropertiesRequest()
        {
            OpticalLineKind = native.OpticalLineKind.ToGrpc(),
        };
        grpc.SplittersRatios.AddRange(native.SplitterRatios);
        return grpc;
    }

    private static GrpcSetOpticalLinePropertiesRequest.Types.OpticalLineKind ToGrpc(this OpticalLineKind native)
    {
        return native switch
        {
            OpticalLineKind.PointToPoint => GrpcSetOpticalLinePropertiesRequest.Types.OpticalLineKind.PointToPoint,
            OpticalLineKind.Pon => GrpcSetOpticalLinePropertiesRequest.Types.OpticalLineKind.Pon,
            OpticalLineKind.PonToOnt => GrpcSetOpticalLinePropertiesRequest.Types.OpticalLineKind.PonToOnt,
            OpticalLineKind.Unspecified => GrpcSetOpticalLinePropertiesRequest.Types.OpticalLineKind.Unspecified,

            // TODO: consider disabling CS8524 and enforcing CS8509 instead, see https://stackoverflow.com/a/68227845/23715
            _ => throw new ArgumentOutOfRangeException($"Unsupported OpticalLineKind {native}")
        };
    }
}
