namespace Iit.Fibertest.Dto
{
    public class RftsEventsDto
    {
        public string? ErrorMessage;

        public bool IsNoFiber = false;
        public RftsLevelDto[]? LevelArray;
        public RftsEventsSummaryDto? Summary;
    }

    public class RftsLevelDto
    {
        public FiberState Level;
        public bool IsFailed;
        public string? FirstProblemLocation;
        public RftsEventDto[] EventArray = null!;
        public TotalFiberLossDto TotalFiberLoss = null!;
    }

    public enum RftsWords
    {
        yes,
        fail,
        pass,
        newEvent,
        fiberBreak,
        empty
    }

    public class RftsEventDto
    {
        public int Ordinal;
        public bool IsNew;
        public bool IsFailed;

        public string LandmarkTitle = null!;
        public EquipmentType LandmarkType;
        public RftsWords State;
        public string DamageType = "";
        public string DistanceKm = null!;
        public RftsWords Enabled;
        public string EventType = null!;

        public string? ReflectanceCoeff;
        public string? AttenuationInClosure;
        public string? AttenuationCoeff;

        // для нового события не может быть порогов
        public MonitoringThreshold? ReflectanceCoeffThreshold;
        public MonitoringThreshold? AttenuationInClosureThreshold;
        public MonitoringThreshold? AttenuationCoeffThreshold;

        public string? ReflectanceCoeffDeviation;
        public string? AttenuationInClosureDeviation;
        public string? AttenuationCoeffDeviation;
    }

    public class TotalFiberLossDto
    {
        public double Value;
        public MonitoringThreshold Threshold = null!;
        public double Deviation;
        public bool IsPassed;
    }

    public class MonitoringThreshold
    {
        public double Value;
        public bool IsAbsolute;
    }

    public class RftsEventsSummaryDto
    {
        public FiberState TraceState;
        public double BreakLocation; // только для FiberBreak для остальных 0.0
        public double Orl;

        public LevelState[]? LevelStates; // на русском, заполнить в клиенте
    }

    public class LevelState
    {
        public string LevelTitle = null!;
        public string State = null!;
    }
}