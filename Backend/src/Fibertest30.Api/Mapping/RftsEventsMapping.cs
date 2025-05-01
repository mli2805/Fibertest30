namespace Fibertest30.Api;

public static class RftsEventsMapping
{
    public static RftsEventsData ToProto(this Iit.Fibertest.Dto.RftsEventsDto dto)
    {
        var rftsEventsData = new RftsEventsData
        {
            ErrorMessage = dto.ErrorMessage ?? "", // Convert null to empty string
            IsNoFiber = dto.IsNoFiber,
            LevelArray = { dto.LevelArray?.Select(ToProto) ?? [] },
            Summary = dto.Summary != null ? ToProto(dto.Summary) : null
        };

        return rftsEventsData;
    }

    private static RftsLevel ToProto(this Iit.Fibertest.Dto.RftsLevelDto dto)
    {
        return new RftsLevel
        {
            Level = dto.Level.ToProto(),
            IsFailed = dto.IsFailed,
            FirstProblemLocation = dto.FirstProblemLocation ?? "",
            EventArray = { dto.EventArray.Select(e => e.ToProto()) },
            TotalFiberLoss = dto.TotalFiberLoss.ToProto(),
        };
    }

    private static RftsWords ToProto(this Iit.Fibertest.Dto.RftsWords word)
    {
        return word switch
        {
            Iit.Fibertest.Dto.RftsWords.yes => RftsWords.Yes,
            Iit.Fibertest.Dto.RftsWords.fail => RftsWords.Fail,
            Iit.Fibertest.Dto.RftsWords.pass => RftsWords.Pass,
            Iit.Fibertest.Dto.RftsWords.newEvent => RftsWords.NewEvent,
            Iit.Fibertest.Dto.RftsWords.fiberBreak => RftsWords.FiberBreak,
            Iit.Fibertest.Dto.RftsWords.empty => RftsWords.Empty,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    private static RftsEvent ToProto(this Iit.Fibertest.Dto.RftsEventDto dto)
    {
        var rftsEvent = new RftsEvent
        {
            Ordinal = dto.Ordinal,
            IsNew = dto.IsNew,
            IsFailed = dto.IsFailed,
            LandmarkTitle = dto.LandmarkTitle,
            LandmarkType = dto.LandmarkType.ToProto(),
            State = dto.State.ToProto(),
            DamageType = dto.DamageType,
            DistanceKm = dto.DistanceKm,
            Enabled = dto.Enabled.ToProto(),
            EventType = dto.EventType,
            ReflectanceCoeff = dto.ReflectanceCoeff ?? "",
            AttenuationInClosure = dto.AttenuationInClosure ?? "",
            AttenuationCoeff = dto.AttenuationCoeff ?? "",
            ReflectanceCoeffDeviation = dto.ReflectanceCoeffDeviation ?? "",
            AttenuationInClosureDeviation = dto.AttenuationInClosureDeviation ?? "",
            AttenuationCoeffDeviation = dto.AttenuationCoeffDeviation ?? "",
        };

        if (dto.ReflectanceCoeffThreshold != null)
            rftsEvent.ReflectanceCoeffThreshold = dto.ReflectanceCoeffThreshold.ToProto();
        if (dto.AttenuationInClosureThreshold != null)
            rftsEvent.AttenuationInClosureThreshold = dto.AttenuationInClosureThreshold.ToProto();
        if (dto.AttenuationCoeffThreshold != null)
            rftsEvent.AttenuationCoeffThreshold = dto.AttenuationCoeffThreshold.ToProto();

        return rftsEvent;
    }

    private static TotalFiberLoss ToProto(this Iit.Fibertest.Dto.TotalFiberLossDto dto)
    {
        return new TotalFiberLoss
        {
            Value = dto.Value,
            Threshold = dto.Threshold.ToProto(),
            Deviation = dto.Deviation,
            IsPassed = dto.IsPassed,
        };
    }

    private static MonitoringThreshold ToProto(this Iit.Fibertest.Dto.MonitoringThreshold dto)
    {
        return new MonitoringThreshold
        {
            Value = dto.Value,
            IsAbsolute = dto.IsAbsolute,
        };

    }

    private static RftsEventsSummary ToProto(this Iit.Fibertest.Dto.RftsEventsSummaryDto dto)
    {
        return new RftsEventsSummary
        {
            TraceState = dto.TraceState.ToProto(),
            BreakLocation = dto.BreakLocation,
            Orl = dto.Orl,
            LevelStates = { dto.LevelStates?.Select(ls => ls.ToProto()) ?? [] },
        };
    }

    private static LevelState ToProto(this Iit.Fibertest.Dto.LevelState dto)
    {
        return new LevelState
        {
            LevelTitle = dto.LevelTitle,
            State = dto.State,
        };
    }
}

