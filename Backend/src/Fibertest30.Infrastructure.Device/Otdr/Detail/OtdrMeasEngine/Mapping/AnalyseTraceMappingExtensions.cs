using GrpcAnalyseTraceRequest = Optixsoft.GrpcOtdr.AnalyseTraceRequest;
using GrpcAnalyseTraceResponse = Optixsoft.GrpcOtdr.AnalyseTraceResponse;
using GrpcAnalysisParameters = Optixsoft.GrpcOtdr.AnalysisParameters;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class AnalyseTraceMappingExtensions
{
    public static GrpcAnalyseTraceRequest ToGrpc(this AnalyseTraceRequest native)
    {
        var grpc = new GrpcAnalyseTraceRequest()
        {
            Trace = Google.Protobuf.ByteString.CopyFrom(native.Trace),
        };
        if (native.AnalysisParameters != null)
        {
            grpc.AnalysisParameters = native.AnalysisParameters.ToGrpc();
        }
        return grpc;
    }

    public static AnalyseTraceResponse FromGrpc(this GrpcAnalyseTraceResponse grpc)
    {
        return new AnalyseTraceResponse(Trace: grpc.Trace.ToByteArray());
    }

    private static GrpcAnalysisParameters ToGrpc(this AnalysisParameters native)
    {
        var grpc = new GrpcAnalysisParameters();
        if (native.ReflectanceThreshold != null)
        {
            grpc.ReflectanceThreshold = native.ReflectanceThreshold.Value;
        }
        if (native.LossThreshold != null)
        {
            grpc.LossThreshold = native.LossThreshold.Value;
        }
        if (native.AttenuationThreshold != null)
        {
            grpc.AttenuationThreshold = native.AttenuationThreshold.Value;
        }
        if (native.EndOfFiberThreshold != null)
        {
            grpc.EndOfFiberThreshold = native.EndOfFiberThreshold.Value;
        }
        return grpc;
    }
}
