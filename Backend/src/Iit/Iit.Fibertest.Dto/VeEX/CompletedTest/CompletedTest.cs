﻿

// ReSharper disable InconsistentNaming

namespace Iit.Fibertest.Dto
{
    public class Linkmap
    {
        public string self { get; set; }
    }

    public class Report
    {
        public string self { get; set; }
    }

    public class Traces
    {
        public string self { get; set; }
    }


    public class CompletedTest
    {
        public string extendedResult { get; set; }
        public int id { get; set; } // completed test ID
        public int[] indicesOfReferenceTraces { get; set; }
        public Linkmap linkmap { get; set; }
        public string reason { get; set; }
        public Failure failure { get; set; }
        public Report report { get; set; }
        public string result { get; set; }
        public DateTime started { get; set; }
        public Guid testId { get; set; }
        public TraceChange traceChange { get; set; }
        public Traces traces { get; set; }
        public string type { get; set; }
    }

    public class CompletedTestPortion
    {
        public List<CompletedTest> items { get; set; }
        public int total { get; set; }
    }

    public static class CompletedTestExt
    {
        public static MonitoringCurrentStep GetMonitoringCurrentStep(this CompletedTest completedTest)
        {
            if (completedTest.extendedResult != null)
            {
                if (completedTest.extendedResult.StartsWith("otdr"))
                    return MonitoringCurrentStep.FailedOtdrProblem;
                if (completedTest.extendedResult.StartsWith("otau"))
                    return MonitoringCurrentStep.FailedOtauProblem;
            }

            return MonitoringCurrentStep.MeasurementFinished;
        }
    }
}
