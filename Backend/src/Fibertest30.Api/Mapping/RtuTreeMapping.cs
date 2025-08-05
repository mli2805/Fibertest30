using Iit.Fibertest.Dto;

namespace Fibertest30.Api;

public static class RtuTreeMapping
{

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
        Iit.Fibertest.Dto.DoubleAddress result = new()
        {
            Main = doubleAddress.Main.FromProto(),
            HasReserveAddress = doubleAddress.HasReserveAddress,
        };

        if (doubleAddress.Reserve != null)
            result.Reserve = doubleAddress.Reserve.FromProto();

        return result;
    }

    private static LeafOfAcceptableMeasParams ToProto(this Iit.Fibertest.Dto.LeafOfAcceptableMeasParams leaf)
    {
        return new LeafOfAcceptableMeasParams()
        {
            Resolutions = { leaf.Resolutions },
            PulseDurations = { leaf.PulseDurations },
            PeriodsToAverage = { leaf.PeriodsToAverage },
            MeasCountsToAverage = { leaf.MeasCountsToAverage }
        };
    }

    private static BranchOfAcceptableMeasParams ToProto(this Iit.Fibertest.Dto.BranchOfAcceptableMeasParams branch)
    {
        var result = new BranchOfAcceptableMeasParams()
        {
            BackscatterCoeff = branch.BackscatteredCoefficient,
            RefractiveIndex = branch.RefractiveIndex,
        };
        foreach (string distancesKey in branch.Distances.Keys)
        {
            result.Distances.Add(new DistanceMeasParam()
            {
                Distance = distancesKey,
                OtherParams = branch.Distances[distancesKey].ToProto()
            });
        }

        return result;
    }

    private static TreeOfAcceptableMeasParams ToProto(this Iit.Fibertest.Dto.TreeOfAcceptableMeasParams tree)
    {
        var result = new TreeOfAcceptableMeasParams();
        foreach (string unitsKey in tree.Units.Keys)
        {
            result.Units.Add(new UnitMeasParam()
            {
                Unit = unitsKey,
                Branch = tree.Units[unitsKey].ToProto()
            });
        }
        return result;
    }

    private static PortOfOtau ToProto(this OtauPortDto otauPortDto)
    {
        // NetAddress не должен быть null, a в базе был
        // ReSharper disable once ConditionIsAlwaysTrueOrFalseAccordingToNullableAPIContract
        var netAddress = otauPortDto.NetAddress != null ? otauPortDto.NetAddress : new Iit.Fibertest.Dto.NetAddress();
        
        PortOfOtau portOfOtau = new PortOfOtau()
        {
            OtauNetAddress = netAddress.ToProto(),
            OtauSerial = otauPortDto.Serial,
            OpticalPort = otauPortDto.OpticalPort,
            IsPortOnMainCharon = otauPortDto.IsPortOnMainCharon,
            MainCharonPort = otauPortDto.MainCharonPort,
        };
        if (otauPortDto.OtauId != null) // main MAK-100 OTAU has no ID
        {
            portOfOtau.OtauId = otauPortDto.OtauId;
        }

        return portOfOtau;
    }

    public static OtauPortDto FromProto(this PortOfOtau portOfOtau)
    {
        var otauPortDto = new OtauPortDto()
        {
            NetAddress = portOfOtau.OtauNetAddress?.FromProto() ?? new Iit.Fibertest.Dto.NetAddress(),
            Serial = portOfOtau.OtauSerial,
            OpticalPort = portOfOtau.OpticalPort,
            IsPortOnMainCharon = portOfOtau.IsPortOnMainCharon,
            MainCharonPort = portOfOtau.MainCharonPort
        };
        if (portOfOtau.HasOtauId)
            otauPortDto.OtauId = portOfOtau.OtauId;
        return otauPortDto;
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
            FastDuration = (int)trace.FastDuration.TotalSeconds,
            PreciseDuration = (int)trace.PreciseDuration.TotalSeconds,
            AdditionalDuration = (int)trace.AdditionalDuration.TotalSeconds,
            PreciseSorId = trace.PreciseSorId,
            FastSorId = trace.FastSorId,
            AdditionalSorId = trace.AdditionalSorId,
            SorFileId = trace.SorFileId,
            BaseRefType = trace.BaseRefType.ToProto(),
        };
        if (trace.OtauPort != null) // only for attached trace
        {
            protoTrace.Port = trace.OtauPort.ToProto();
        }

        if (trace.Comment != null)
            protoTrace.Comment = trace.Comment;
        if (trace.RegisteredAt != null)
            protoTrace.RegisteredAt = ((DateTime)trace.RegisteredAt).ToUniversalTime().ToTimestamp();

        return protoTrace;
    }

    public static Rtu ToProto(this RtuDto rtu)
    {
        Rtu protoRtu = new Rtu()
        {
            RtuId = rtu.RtuId.ToString(),
            NodeId = rtu.NodeId.ToString(),
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
            PreciseMeas = (int)rtu.PreciseMeas,
            PreciseSave = (int)rtu.PreciseSave,
            FastSave = (int)rtu.FastSave,

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

        if (rtu.TreeOfAcceptableMeasParams != null) // after RTU is initialized
            protoRtu.TreeOfAcceptableMeasParams = rtu.TreeOfAcceptableMeasParams.ToProto();

        if (rtu.Comment != null)
            protoRtu.Comment = rtu.Comment;

        return protoRtu;
    }

    public static AttachOtauDto FromProto(this AttachOtauRequest request)
    {
        return new AttachOtauDto()
        {
            RtuId = Guid.Parse(request.RtuId),
            NetAddress = request.NetAddress.FromProto(),
            OpticalPort = request.OpticalPort,
        };
    }

    public static DetachOtauDto FromProto(this DetachOtauRequest request)
    {
        return new DetachOtauDto()
        {
            RtuId = Guid.Parse(request.RtuId),
            OtauId = Guid.Parse(request.OtauId),
            NetAddress = request.NetAddress.FromProto(),
            OpticalPort = request.OpticalPort,
        };
    }

    public static TraceStatBaseline ToProto(this BaselineStat b)
    {
        return new TraceStatBaseline()
        {
            SorFileId = b.SorFileId,
            BaseRefType = b.BaseRefType.ToProto(),
            AssignedAt = b.AssignedAt.ToUniversalTime().ToTimestamp(),
            ByUser = b.ByUser
        };
    }

    public static TraceStatMeasurement ToProto(this MeasurementStat m)
    {
        return new TraceStatMeasurement()
        {
            SorFileId = m.SorFileId,
            BaseRefType = m.BaseRefType.ToProto(),
            RegisteredAt = m.RegisteredAt.ToUniversalTime().ToTimestamp(),
            IsEvent = m.IsEvent,
            TraceState = m.TraceState.ToProto()
        };
    }
}