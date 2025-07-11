using Iit.Fibertest.Dto;

namespace Fibertest30.Api;

public static class FtEnumsMapping
{
    public static EquipmentType ToProto(this Iit.Fibertest.Dto.EquipmentType type)
    {
        return type switch
        {
            Iit.Fibertest.Dto.EquipmentType.AdjustmentPoint => EquipmentType.AdjustmentPoint,
            Iit.Fibertest.Dto.EquipmentType.EmptyNode => EquipmentType.EmptyNode,
            Iit.Fibertest.Dto.EquipmentType.CableReserve => EquipmentType.CableReserve,
            Iit.Fibertest.Dto.EquipmentType.Other => EquipmentType.Other,
            Iit.Fibertest.Dto.EquipmentType.Closure => EquipmentType.Closure,
            Iit.Fibertest.Dto.EquipmentType.Cross => EquipmentType.Cross,
            Iit.Fibertest.Dto.EquipmentType.Well => EquipmentType.Well,
            Iit.Fibertest.Dto.EquipmentType.Terminal => EquipmentType.Terminal,
            Iit.Fibertest.Dto.EquipmentType.Rtu => EquipmentType.Rtu,
            Iit.Fibertest.Dto.EquipmentType.AccidentPlace => EquipmentType.AccidentPlace,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static Iit.Fibertest.Dto.EquipmentType FromProto(this EquipmentType type)
    {
        var num = (int)type;
        return (Iit.Fibertest.Dto.EquipmentType)num;
    }

    public static RtuMaker ToProto(this Iit.Fibertest.Dto.RtuMaker rtuMaker)
    {
        return rtuMaker switch
        {
            Iit.Fibertest.Dto.RtuMaker.IIT => RtuMaker.Iit,
            Iit.Fibertest.Dto.RtuMaker.VeEX => RtuMaker.Veex,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static Iit.Fibertest.Dto.RtuMaker FromProto(this RtuMaker rtuMaker)
    {
        int code = (int)rtuMaker;
        return (Iit.Fibertest.Dto.RtuMaker)code;
    }


    public static RtuPartState ToProto(this Iit.Fibertest.Dto.RtuPartState state)
    {
        return state switch
        {
            Iit.Fibertest.Dto.RtuPartState.Broken => RtuPartState.Broken,
            Iit.Fibertest.Dto.RtuPartState.NotSetYet => RtuPartState.NotSetYet,
            Iit.Fibertest.Dto.RtuPartState.Ok => RtuPartState.Ok,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static MonitoringState ToProto(this Iit.Fibertest.Dto.MonitoringState state)
    {
        return state switch
        {
            Iit.Fibertest.Dto.MonitoringState.Unknown => MonitoringState.Unknown,
            Iit.Fibertest.Dto.MonitoringState.Off => MonitoringState.Off,
            Iit.Fibertest.Dto.MonitoringState.On => MonitoringState.On,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static FiberState ToProto(this Iit.Fibertest.Dto.FiberState state)
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

    public static Iit.Fibertest.Dto.FiberState FromProto(this FiberState state)
    {
        int code = (int)state;
        return (Iit.Fibertest.Dto.FiberState)code;
    }

    public static TceLinkState ToProto(this TraceToTceLinkState state)
    {
        return state switch
        {
            TraceToTceLinkState.NoLink => TceLinkState.NoLink,
            TraceToTceLinkState.LinkTceOff => TceLinkState.SnmpTrapOff,
            TraceToTceLinkState.LinkTceOn => TceLinkState.SnmpTrapOn,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static ChannelEvent ToProto(this Iit.Fibertest.Dto.ChannelEvent evnt)
    {
        return evnt switch
        {
            Iit.Fibertest.Dto.ChannelEvent.Nothing => ChannelEvent.Nothing,
            Iit.Fibertest.Dto.ChannelEvent.Broken => ChannelEvent.Broken,
            Iit.Fibertest.Dto.ChannelEvent.Repaired => ChannelEvent.Repaired,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static BaseRefType ToProto(this Iit.Fibertest.Dto.BaseRefType type)
    {
        return type switch
        {
            Iit.Fibertest.Dto.BaseRefType.None => BaseRefType.None,
            Iit.Fibertest.Dto.BaseRefType.Precise => BaseRefType.Precise,
            Iit.Fibertest.Dto.BaseRefType.Fast => BaseRefType.Fast,
            Iit.Fibertest.Dto.BaseRefType.Additional => BaseRefType.Additional,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static Iit.Fibertest.Dto.BaseRefType FromProto(this BaseRefType type)
    {
        int code = (int)type;
        return (Iit.Fibertest.Dto.BaseRefType)code;
    }

    public static EventStatus ToProto(this Iit.Fibertest.Dto.EventStatus status)
    {
        return status switch
        {
            Iit.Fibertest.Dto.EventStatus.JustMeasurementNotAnEvent => EventStatus.JustMeasurementNotAnEvent,
            Iit.Fibertest.Dto.EventStatus.EventButNotAnAccident => EventStatus.EventButNotAnAccident,
            Iit.Fibertest.Dto.EventStatus.NotImportant => EventStatus.NotImportant,
            Iit.Fibertest.Dto.EventStatus.Planned => EventStatus.Planned,
            Iit.Fibertest.Dto.EventStatus.NotConfirmed => EventStatus.NotConfirmed,
            Iit.Fibertest.Dto.EventStatus.Unprocessed => EventStatus.Unprocessed,
            Iit.Fibertest.Dto.EventStatus.Suspended => EventStatus.Suspended,
            Iit.Fibertest.Dto.EventStatus.Confirmed => EventStatus.Confirmed,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public static MonitoringCurrentStep ToProto(this Iit.Fibertest.Dto.MonitoringCurrentStep step)
    {
        return step switch
        {
            Iit.Fibertest.Dto.MonitoringCurrentStep.Unknown => MonitoringCurrentStep.Unknown,
            Iit.Fibertest.Dto.MonitoringCurrentStep.Idle => MonitoringCurrentStep.Idle,
            Iit.Fibertest.Dto.MonitoringCurrentStep.Toggle => MonitoringCurrentStep.Toggle,
            Iit.Fibertest.Dto.MonitoringCurrentStep.Measure => MonitoringCurrentStep.Measure,
            Iit.Fibertest.Dto.MonitoringCurrentStep.FailedOtauProblem => MonitoringCurrentStep.FailedOtauProblem,
            Iit.Fibertest.Dto.MonitoringCurrentStep.FailedOtdrProblem => MonitoringCurrentStep.FailedOtdrProblem,
            Iit.Fibertest.Dto.MonitoringCurrentStep.Interrupted => MonitoringCurrentStep.Interrupted,
            Iit.Fibertest.Dto.MonitoringCurrentStep.Analysis => MonitoringCurrentStep.Analysis,
            Iit.Fibertest.Dto.MonitoringCurrentStep.MeasurementFinished => MonitoringCurrentStep.MeasurementFinished,
            _ => throw new ArgumentOutOfRangeException()

        };
    }

    public static OpticalAccidentType ToProto(this Iit.Fibertest.Dto.OpticalAccidentType type)
    {
        return type switch
        {
            Iit.Fibertest.Dto.OpticalAccidentType.Break => OpticalAccidentType.Break,
            Iit.Fibertest.Dto.OpticalAccidentType.Loss => OpticalAccidentType.Loss,
            Iit.Fibertest.Dto.OpticalAccidentType.Reflectance => OpticalAccidentType.Reflectance,
            Iit.Fibertest.Dto.OpticalAccidentType.LossCoeff => OpticalAccidentType.LossCoeff,
            Iit.Fibertest.Dto.OpticalAccidentType.TotalLoss => OpticalAccidentType.TotalLoss,
            Iit.Fibertest.Dto.OpticalAccidentType.None => OpticalAccidentType.None,
            _ => throw new ArgumentOutOfRangeException()
        };
    }
}