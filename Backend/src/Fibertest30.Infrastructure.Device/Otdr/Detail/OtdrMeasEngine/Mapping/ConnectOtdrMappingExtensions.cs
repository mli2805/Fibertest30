using GrpcConnectOtdrRequest = Optixsoft.GrpcOtdr.ConnectOtdrRequest;
using GrpcConnectOtdrResponse = Optixsoft.GrpcOtdr.ConnectOtdrResponse;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public static class ConnectOtdrMappingExtensions
{
    public static GrpcConnectOtdrRequest ToGrpc(this ConnectOtdrRequest native)
    {
        return new GrpcConnectOtdrRequest() { ConnectionParameters = native.OtdrConnectionParameters.ToGrpc() };
    }

    public static ConnectOtdrResponse FromGrpc(this GrpcConnectOtdrResponse grpc)
    {
        return new ConnectOtdrResponse(
            OtdrInfo: grpc.OtdrInfo.FromGrpc(),
            OtdrMeasurementParameterSet: grpc.OtdrSupportedMeasurementParameters.FromGrpc());
    }

    private static GrpcConnectOtdrRequest.Types.OtdrConnectionParameters ToGrpc(this OtdrConnectionParameters native)
    {
        var grpc = new GrpcConnectOtdrRequest.Types.OtdrConnectionParameters();
        if (native is UsbOtdrConnectionParameters)
        {
            grpc.Usb = new();
        }
        else if (native is TcpOtdrConnectionParameters tcp)
        {
            grpc.Tcp = tcp.ToGrpc();
        }
        else
        {
            throw new ArgumentException($"OtdrConnectionParmaeters subtype is not supported: {native.GetType().Name}");
        }
        return grpc;
    }

    private static GrpcConnectOtdrRequest.Types.OtdrConnectionParameters.Types.Tcp ToGrpc(this TcpOtdrConnectionParameters native)
    {
        return new()
        {
            Host = native.Host,
            Port = native.Port
        };
    }

    private static OtdrInfo FromGrpc(this GrpcConnectOtdrResponse.Types.OtdrInfo grpc)
    {
        if (grpc == null)
        {
            throw new Exception("OtdrMeasEngine GRPC server has not returned OtdrInfo");
        }
        return new OtdrInfo(
            MainframeId: grpc.MainframeId,
            MainframeSerialNumber: grpc.MainframeSerialNumber,
            OpticalModuleSerialNumber: grpc.OpticalModuleSerialNumber);
    }

    private static OtdrMeasurementParameterSet FromGrpc(this GrpcConnectOtdrResponse.Types.OtdrSupportedMeasurementParameters grpc)
    {
        if (grpc == null)
        {
            throw new Exception("OtdrMeasEngine GRPC server has not returned OtdrSupportedMeasurementParameters");
        }
        return new OtdrMeasurementParameterSet(
            LaserUnits: grpc.LaserUnits.ToDictionary(lu => lu.Key, lu => lu.Value.FromGrpc()));
    }

    private static LaserUnitSet FromGrpc(
        this GrpcConnectOtdrResponse.Types.OtdrSupportedMeasurementParameters.Types.LaserUnitSetPair.Types.LaserUnitSet grpc)
    {
        return new LaserUnitSet(
            DistanceRanges: grpc.DistanceRanges.ToDictionary(dr => dr.Key, dr => dr.Value.FromGrpc()),
            DwdmChannels: grpc.DwdmChannels.ToList(),
            Connector: grpc.Connector);
    }

    private static DistanceRangeSet FromGrpc(
        this GrpcConnectOtdrResponse.Types.OtdrSupportedMeasurementParameters.Types.LaserUnitSetPair.Types
                .LaserUnitSet.Types.DistanceRangeSetPair.Types.DistanceRangeSet grpc)
    {
        return new DistanceRangeSet(
            AveragingTimes: grpc.AveragingTimes.ToList(),
            LiveAveragingTimes: grpc.LiveRefreshTimes.ToList(),
            PulseDurations: grpc.PulseDurations.ToList(),
            Resolutions: grpc.Resolutions.ToList());
    }
}
