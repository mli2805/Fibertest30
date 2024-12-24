namespace Iit.Fibertest.Dto
{
    public enum MonitoringCurrentStep
    {
        Unknown = -1,
        Idle,
        Toggle,
        Measure,
        FailedOtauProblem,
        FailedOtdrProblem,
        Interrupted,
        Analysis,
        MeasurementFinished,
    }
}