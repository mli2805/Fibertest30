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
        public string Title = null!;
        public bool IsFailed;
        public string FirstProblemLocation = null!;
        public RftsEventDto[] EventArray = null!;
        public TotalFiberLossDto TotalFiberLoss = null!;
    }

    public class RftsEventDto
    {
        public int Ordinal;
        public bool IsNew;
        public bool IsFailed;

        public string LandmarkTitle = null!;
        public string LandmarkType = null!;
        public string State = null!;
        public string DamageType = "";
        public string DistanceKm = null!;
        public string Enabled = null!;
        public string EventType = null!;

        public string? ReflectanceCoeff;
        public string? AttenuationInClosure;
        public string? AttenuationCoeff;

        public MonitoringThreshold ReflectanceCoeffThreshold = null!;
        public MonitoringThreshold AttenuationInClosureThreshold = null!;
        public MonitoringThreshold AttenuationCoeffThreshold = null!;

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
        public string? TraceState; // на русском, заполнить в клиенте
        public double Orl;
        public LevelState[]? LevelStates; // на русском, заполнить в клиенте
    }

    public class LevelState
    {
        public string LevelTitle = null!;
        public string State = null!;
    }
}