namespace Fibertest30.Api;

public static class EventTablesMapping
{
    public static OpticalEvent ToProto(this Iit.Fibertest.Dto.OpticalEventDto dto)
    {
        return new OpticalEvent
        {
            EventId = dto.EventId,
            MeasuredAt = dto.MeasurementTimestamp.ToTimestamp(),
            RegisteredAt = dto.EventRegistrationTimestamp.ToTimestamp(),

            RtuTitle = dto.RtuTitle,
            RtuId = dto.RtuId.ToString(),
            TraceTitle = dto.TraceTitle,
            TraceId = dto.TraceId.ToString(),

            BaseRefType = dto.BaseRefType.ToProto(),
            TraceState = dto.TraceState.ToProto(),

            EventStatus = dto.EventStatus.ToProto(),
            StatusChangedAt = dto.StatusChangedTimestamp.ToTimestamp(),
            StatusChangedByUser = dto.StatusChangedByUser,

            Comment = dto.Comment
        };
    }

    public static NetworkEvent ToProto(this Iit.Fibertest.Dto.NetworkEventDto dto)
    {
        return new NetworkEvent
        {
            EventId = dto.EventId,
            RegisteredAt = dto.EventRegistrationTimestamp.ToTimestamp(),
            RtuId = dto.RtuId.ToString(),
            RtuTitle = dto.RtuTitle,
            IsRtuAvailable = dto.IsRtuAvailable,
            OnMainChannel = dto.OnMainChannel.ToProto(),
            OnReserveChannel = dto.OnReserveChannel.ToProto(),
        };
    }

    public static BopEvent ToProto(this Iit.Fibertest.Dto.BopEventDto dto)
    {
        return new BopEvent
        {
            EventId = dto.EventId, 
            RegisteredAt = dto.EventRegistrationTimestamp.ToTimestamp(), 
            BopAddress = dto.BopAddress,
            RtuId = dto.RtuId.ToString(),
            RtuTitle = dto.RtuTitle,
            Serial = dto.Serial,
            IsBopOk = dto.BopState,
        };
    }

    public static RtuAccident ToProto(this Iit.Fibertest.Dto.RtuAccidentDto dto)
    {
        return new RtuAccident
        {
            Id = dto.Id,
            IsMeasurementProblem = dto.IsMeasurementProblem,
            ReturnCode = (int)dto.ReturnCode,
            RegisteredAt = dto.EventRegistrationTimestamp.ToTimestamp(),
            RtuTitle = dto.RtuTitle,
            RtuId = dto.RtuId.ToString(),
            TraceTitle = dto.TraceTitle,
            TraceId = dto.TraceId.ToString(),
            BaseRefType = dto.BaseRefType.ToProto(),
            Comment = dto.Comment,
        };
    }
}