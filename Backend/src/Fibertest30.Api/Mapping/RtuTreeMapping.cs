using Iit.Fibertest.Dto;

namespace Fibertest30.Api;

public static class RtuMgmtMapping
{
    public static Iit.Fibertest.Dto.InitializeRtuDto FromProto(this InitializeRtuDto dto)
    {
        return new Iit.Fibertest.Dto.InitializeRtuDto()
        {
            RtuId = Guid.Parse(dto.RtuId), 
            RtuAddresses = dto.RtuAddresses.FromProto()
        };
    }

    public static RtuInitializedDto ToProto(this Iit.Fibertest.Dto.RtuInitializedDto dto)
    {
        return new RtuInitializedDto() { IsInitialized = dto.IsInitialized, };
    }
}
public static class RtuTreeMapping
{
    private static RtuMaker ToProto(this Iit.Fibertest.Dto.RtuMaker rtuMaker)
    {
        return rtuMaker switch
        {
            Iit.Fibertest.Dto.RtuMaker.IIT => RtuMaker.Iit,
            Iit.Fibertest.Dto.RtuMaker.VeEX => RtuMaker.Veex,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    private static RtuPartState ToProto(this Iit.Fibertest.Dto.RtuPartState state)
    {
        return state switch
        {
            Iit.Fibertest.Dto.RtuPartState.Broken => RtuPartState.Broken,
            Iit.Fibertest.Dto.RtuPartState.NotSetYet => RtuPartState.NotSetYet,
            Iit.Fibertest.Dto.RtuPartState.Ok => RtuPartState.Ok,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    private static MonitoringState ToProto(this Iit.Fibertest.Dto.MonitoringState state)
    {
        return state switch
        {
            Iit.Fibertest.Dto.MonitoringState.Unknown => MonitoringState.Unknown,
            Iit.Fibertest.Dto.MonitoringState.Off => MonitoringState.Off,
            Iit.Fibertest.Dto.MonitoringState.On => MonitoringState.On,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    private static FiberState ToProto(this Iit.Fibertest.Dto.FiberState state)
    {
        return state switch
        {
            Iit.Fibertest.Dto.FiberState.NotInTrace => FiberState.NotInTrace,
            Iit.Fibertest.Dto.FiberState.NotJoined => FiberState.NotJoined,
            Iit.Fibertest.Dto.FiberState.Unknown => FiberState.Unknown,
            Iit.Fibertest.Dto.FiberState.NotInZone => FiberState.NotInZone,
            Iit.Fibertest.Dto.FiberState.Ok => FiberState.Ok,
            Iit.Fibertest.Dto.FiberState.Suspicion => FiberState.Suspicion,
            Iit.Fibertest.Dto.FiberState.Minor => FiberState.Minor,
            Iit.Fibertest.Dto.FiberState.Major => FiberState.Major,
            Iit.Fibertest.Dto.FiberState.Critical => FiberState.Critical,
            Iit.Fibertest.Dto.FiberState.User => FiberState.User,
            Iit.Fibertest.Dto.FiberState.FiberBreak => FiberState.FiberBreak,
            Iit.Fibertest.Dto.FiberState.NoFiber => FiberState.NoFiber,
            Iit.Fibertest.Dto.FiberState.HighLighted => FiberState.HighLighted,
            Iit.Fibertest.Dto.FiberState.DistanceMeasurement => FiberState.DistanceMeasurement,
            Iit.Fibertest.Dto.FiberState.Nothing => FiberState.Nothing,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    private static TceLinkState ToProto(this TraceToTceLinkState state)
    {
        return state switch
        {
            TraceToTceLinkState.NoLink => TceLinkState.NoLink,
            TraceToTceLinkState.LinkTceOff => TceLinkState.SnmpTrapOff,
            TraceToTceLinkState.LinkTceOn => TceLinkState.SnmpTrapOn,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static NetAddress ToProto(this Iit.Fibertest.Dto.NetAddress netAddress)
    {
        return new NetAddress()
        {
            Ip4Address = netAddress.Ip4Address,
            HostName = netAddress.HostName,
            Port = netAddress.Port,
        };
    }

    public static Iit.Fibertest.Dto.NetAddress FromProto(this NetAddress netAddress)
    {
        return new Iit.Fibertest.Dto.NetAddress()
        {
            Ip4Address = netAddress.Ip4Address,
            HostName = netAddress.HostName,
            Port = netAddress.Port,

        };
    }

    public static Iit.Fibertest.Dto.DoubleAddress FromProto(this DoubleAddress doubleAddress)
    {
        Iit.Fibertest.Dto.DoubleAddress result = new Iit.Fibertest.Dto.DoubleAddress()
        {
            Main = doubleAddress.Main.FromProto(),
            HasReserveAddress = doubleAddress.HasReserveAddress,
        };

        if (doubleAddress.Reserve != null)
            result.Reserve = doubleAddress.Reserve.FromProto();

        return result;
    }

    private static PortOfOtau ToProto(this OtauPortDto otauPortDto)
    {
        PortOfOtau portOfOtau = new PortOfOtau()
        {
            OtauNetAddress = otauPortDto.NetAddress.ToProto(),
            OtauSerial = otauPortDto.Serial,
            OpticalPort = otauPortDto.OpticalPort,
            IsPortOnMainCharon = otauPortDto.IsPortOnMainCharon,
            MainCharonPort = otauPortDto.MainCharonPort,
        };
        if (otauPortDto.OtauId != null) // main MAK-100 OTAU has no ID
        {
            otauPortDto.OtauId = otauPortDto.OtauId;
        }
        return portOfOtau;
    }

    private static Bop ToProto(this OtauWebDto otau)
    {
        return new Bop()
        {
            BopId = otau.OtauId.ToString(),
            RtuId = otau.RtuId.ToString(),
            BopNetAddress = otau.OtauNetAddress.ToProto(),
            MasterPort = otau.MasterPort,
            IsOk = otau.IsOk,
            Serial = otau.Serial,
            PortCount = otau.PortCount,
            Traces = { otau.Children.Where(c => c is TraceDto).Cast<TraceDto>().Select(t => t.ToProto()) },
        };
    }

    private static Trace ToProto(this TraceDto trace)
    {
        Trace protoTrace = new Trace()
        {
            TraceId = trace.TraceId.ToString(),
            RtuId = trace.RtuId.ToString(),
            Title = trace.Title,
            IsAttached = trace.IsAttached,
            State = trace.State.ToProto(),
            HasEnoughBaseRefsToPerformMonitoring = trace.HasEnoughBaseRefsToPerformMonitoring,
            IsIncludedInMonitoringCycle = trace.IsIncludedInMonitoringCycle,
            TceLinkState = trace.TceLinkState.ToProto(),
        };
        if (trace.OtauPort != null) // only for attached trace
        {
            protoTrace.Port = trace.OtauPort.ToProto();
        }
        return protoTrace;
    }

    public static Rtu ToProto(this RtuDto rtu)
    {
        Rtu protoRtu = new Rtu()
        {
            RtuId = rtu.RtuId.ToString(),
            RtuMaker = rtu.RtuMaker.ToProto(),
            Title = rtu.Title,

            OwnPortCount = rtu.OwnPortCount,
            FullPortCount = rtu.FullPortCount,

            MainChannel = rtu.MainChannel.ToProto(),
            MainChannelState = rtu.MainChannelState.ToProto(),
            ReserveChannel = rtu.ReserveChannel.ToProto(),
            ReserveChannelState = rtu.ReserveChannelState.ToProto(),
            IsReserveChannelSet = rtu.IsReserveChannelSet,

            OtdrNetAddress = rtu.OtdrNetAddress.ToProto(),
            MonitoringMode = rtu.MonitoringMode.ToProto(),

            Traces = { rtu.Children.Where(c => c is TraceDto).Cast<TraceDto>().Select(t => t.ToProto()) },
            Bops = { rtu.Children.Where(c => c is OtauWebDto).Cast<OtauWebDto>().Select(o => o.ToProto()) }
        };
        if (rtu.Mfid != null)
            protoRtu.Mfid = rtu.Mfid;
        if (rtu.Mfsn != null)
            protoRtu.Mfsn = rtu.Mfsn;
        if (rtu.Omid != null)
            protoRtu.Omid = rtu.Omid;
        if (rtu.Omsn != null)
            protoRtu.Omsn = rtu.Omsn;
        if (rtu.Serial != null)
            protoRtu.Serial = rtu.Serial;
        if (rtu.Version != null)
            protoRtu.Version = rtu.Version;
        if (rtu.Version2 != null)
            protoRtu.Version2 = rtu.Version2;

        return protoRtu;
    }
}