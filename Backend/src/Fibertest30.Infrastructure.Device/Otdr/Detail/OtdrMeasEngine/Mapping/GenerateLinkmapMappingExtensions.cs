using GrpcGenerateLinkmapRequest = Optixsoft.GrpcOtdr.GenerateLinkmapRequest;
using GrpcGenerateLinkmapRequestParameters = Optixsoft.GrpcOtdr.GenerateLinkmapRequest.Types.Parameters;
using GrpcGenerateLinkmapResponse = Optixsoft.GrpcOtdr.GenerateLinkmapResponse;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class GenerateLinkmapMappingExtensions
{
    public static GrpcGenerateLinkmapRequest ToGrpc(this GenerateLinkmapRequest native)
    {
        var request = new GrpcGenerateLinkmapRequest()
        {
            Parameters = ToRequestParameters(native.MacrobendThreshold)
        };
        request.Sors.AddRange(native.Sors.Select(Google.Protobuf.ByteString.CopyFrom));
        return request;
    }

    public static GenerateLinkmapResponse FromGrpc(this GrpcGenerateLinkmapResponse grpc)
    {
        return new GenerateLinkmapResponse()
        {
            Linkmap = grpc.Linkmap.ToByteArray()
        };
    }

    private static GrpcGenerateLinkmapRequestParameters ToRequestParameters(double? macrobendThreshold)
    {
        var parameters = new GrpcGenerateLinkmapRequestParameters();
        if (macrobendThreshold.HasValue)
        {
            parameters.MacrobendThreshold = macrobendThreshold.Value;
        }
        return parameters;
    }
}
