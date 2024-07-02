using GrpcAnalyseOpticalLineResponse = Optixsoft.GrpcOtdr.AnalyseOpticalLineResponse;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class AnalyseOpticalLineResponseMappingExtensions
{
    public static AnalyseOpticalLineResponse FromGrpc(
        this GrpcAnalyseOpticalLineResponse grpc)
    {
        return new AnalyseOpticalLineResponse(
            Reflectance: grpc.HasReflectance ? grpc.Reflectance : null,
            Loss: grpc.HasLoss ? grpc.Loss : null,
            LmaxNs: grpc.HasLmaxNs ? grpc.LmaxNs : null,
            Snr: grpc.HasSnr ? grpc.Snr : null);
    }
}
