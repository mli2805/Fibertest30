using Google.Protobuf;
using Optixsoft.SorExaminer;
using Optixsoft.SorExaminer.OtdrDataFormat;
using Optixsoft.SorFormat.Protobuf;

namespace Fibertest30.Api;

public static class ProtoUtils
{
    public static GetSorResponse SorToResponse(byte[] sorBytes)
    {
        var measurement = new MeasurementTrace(sorBytes).OtdrData.ToSorDataBuf().ToBytes();
        var baselineBytes = GetBaselineBytes(sorBytes);
        var baseline = baselineBytes != null 
            ? new MeasurementTrace(baselineBytes).OtdrData.ToSorDataBuf().ToBytes()
            : null;

        var response = new GetSorResponse()
        {
            Measurement = ByteString.CopyFrom(measurement), 
            File = ByteString.CopyFrom(sorBytes)
        };

        if (baseline != null)
            response.Baseline = ByteString.CopyFrom(baseline);

        return response;
    }

    public static ByteString MeasurementTraceToSorByteString(MeasurementTrace trace, bool vxsorFormat = true)
    {
        var sor = vxsorFormat
            ? trace.OtdrData.ToSorDataBuf().ToBytes()
            : trace.SorBytes;
        return ByteString.CopyFrom(sor);
    }

    public static byte[]? GetBaselineBytes(byte[] sorBytes)
    {
        OtdrDataKnownBlocks sorData = sorBytes.ToSorData();
        var baseRef = sorData.EmbeddedData.EmbeddedDataBlocks.FirstOrDefault(block => block.Description == @"SOR");
        return baseRef?.Data ?? null;
    }

    public static byte[] GetSorWithoutBaseline(byte[] sorBytes)
    {
        OtdrDataKnownBlocks sorData = sorBytes.ToSorData();
        var blocks = sorData.EmbeddedData.EmbeddedDataBlocks.Where(block => block.Description != @"SOR").ToArray();
        sorData.EmbeddedData.EmbeddedDataBlocks = blocks;
        return sorData.ToBytes();
    }
}