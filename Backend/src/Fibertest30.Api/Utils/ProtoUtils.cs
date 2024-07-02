using Google.Protobuf;
using Optixsoft.SorFormat.Protobuf;

namespace Fibertest30.Api;

public static class ProtoUtils
{
    public static ByteString MeasurementTraceToSorByteString(MeasurementTrace trace, bool vxsorFormat = true)
    {
        var sor = vxsorFormat
            ? trace.OtdrData.ToSorDataBuf().ToBytes()
            : trace.SorBytes;
        return ByteString.CopyFrom(sor);
    }
}