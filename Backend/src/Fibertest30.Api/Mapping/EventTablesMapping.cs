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
}