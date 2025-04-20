namespace Fibertest30.Api;

public static class EventTablesMapping
{
    public static HasCurrentEvents ToProto(this Application.HasCurrentEvents hasCurrentEvents)
    {
        return new HasCurrentEvents
        {
            HasCurrentOpticalEvents = hasCurrentEvents.HasCurrentOpticalEvents,
            HasCurrentNetworkEvents = hasCurrentEvents.HasCurrentNetworkEvents,
            HasCurrentBopNetworkEvents = hasCurrentEvents.HasCurrentBopNetworkEvents,
            HasCurrentRtuAccidents = hasCurrentEvents.HasCurrentRtuAccidents,
        };
    }

    private static AccidentNeighbour ToProto(this Iit.Fibertest.Dto.AccidentNeighbourDto dto)
    {
        return new AccidentNeighbour()
        {
            LandmarkIndex = dto.LandmarkIndex,
            Title = dto.Title,
            Coors = dto.Coors.ToProto(),
            ToRtuOpticalDistanceKm = dto.ToRtuOpticalDistanceKm,
            ToRtuPhysicalDistanceKm = dto.ToRtuPhysicalDistanceKm,
        };
    }

    private static AccidentOnTraceV2 ToProto(this Iit.Fibertest.Dto.AccidentOnTraceV2Dto dto)
    {
        AccidentOnTraceV2 accidentOnTraceV2 = new ()
        {
            BrokenRftsEventNumber = dto.BrokenRftsEventNumber,
            AccidentSeriousness = dto.AccidentSeriousness.ToProto(),
            OpticalTypeOfAccident = dto.OpticalTypeOfAccident.ToProto(),

            IsAccidentInOldEvent = dto.IsAccidentInOldEvent,
            IsAccidentInLastNode = dto.IsAccidentInLastNode,
            AccidentCoors = dto.AccidentCoors.ToProto(),

            AccidentLandmarkIndex = dto.AccidentLandmarkIndex,
            AccidentToRtuOpticalDistanceKm = dto.AccidentToRtuOpticalDistanceKm,
            AccidentTitle = dto.AccidentTitle,
            AccidentToRtuPhysicalDistanceKm = dto.AccidentToRtuPhysicalDistanceKm,

            AccidentToLeftOpticalDistanceKm = dto.AccidentToLeftOpticalDistanceKm,
            AccidentToLeftPhysicalDistanceKm = dto.AccidentToLeftPhysicalDistanceKm,
            AccidentToRightOpticalDistanceKm = dto.AccidentToRightOpticalDistanceKm,
            AccidentToRightPhysicalDistanceKm = dto.AccidentToRightPhysicalDistanceKm,

            EventCode = dto.EventCode,
            DeltaLen = dto.DeltaLen,
        };

        if (dto.Left != null)
            accidentOnTraceV2.Left = dto.Left.ToProto();
        if (dto.Right != null)
            accidentOnTraceV2.Right = dto.Right.ToProto();

        return accidentOnTraceV2;
    }

    public static OpticalEvent ToProto(this Iit.Fibertest.Dto.OpticalEventDto dto)
    {
        // файбертест исторически хранит все даты в локальном времени
        // перед передачей по grpc переводим сначала время в UTC, а затем в прото формат
        // вэб морда получает все времена UTC и
        // DateTimePipe взяв из браузера таймзону клиента показывает время правильно для каждого клиента


        OpticalEvent opticalEvent = new OpticalEvent
        {
            EventId = dto.EventId,
            MeasuredAt = dto.MeasurementTimestamp.ToUniversalTime().ToTimestamp(),
            RegisteredAt = dto.EventRegistrationTimestamp.ToUniversalTime().ToTimestamp(),

            RtuTitle = dto.RtuTitle,
            RtuId = dto.RtuId.ToString(),
            TraceTitle = dto.TraceTitle,
            TraceId = dto.TraceId.ToString(),

            BaseRefType = dto.BaseRefType.ToProto(),
            TraceState = dto.TraceState.ToProto(),

            EventStatus = dto.EventStatus.ToProto(),
            StatusChangedAt = dto.StatusChangedTimestamp.ToUniversalTime().ToTimestamp(),
            StatusChangedByUser = dto.StatusChangedByUser,

            Comment = dto.Comment
        };

        dto.Accidents.ForEach(a=> opticalEvent.Accidents.Add(a.ToProto()));
        return opticalEvent;
    }

    public static NetworkEvent ToProto(this Iit.Fibertest.Dto.NetworkEventDto dto)
    {
        return new NetworkEvent
        {
            EventId = dto.EventId,
            RegisteredAt = dto.EventRegistrationTimestamp.ToUniversalTime().ToTimestamp(),
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
            RegisteredAt = dto.EventRegistrationTimestamp.ToUniversalTime().ToTimestamp(), 
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
            RegisteredAt = dto.EventRegistrationTimestamp.ToUniversalTime().ToTimestamp(),
            RtuTitle = dto.RtuTitle,
            RtuId = dto.RtuId.ToString(),
            TraceTitle = dto.TraceTitle,
            TraceId = dto.TraceId.ToString(),
            BaseRefType = dto.BaseRefType.ToProto(),
            Comment = dto.Comment,
            ClearedAccidentWithId = dto.ClearedAccidentWithId
        };
    }
}