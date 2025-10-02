using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;

namespace Fibertest30.Application
{
    public static class OpticalEventsReportFunctions
    {
        public  static Dictionary<EventStatus, Dictionary<FiberState, int>>
            GetTotals(this List<Measurement> events, GetOpticalEventsReportPdfQuery query)
        {
            var result = new Dictionary<EventStatus, Dictionary<FiberState, int>>();
            foreach (var meas in events.Where(r => IsEventForReport(r, query)))
            {
                if (result.ContainsKey(meas.EventStatus))
                {
                    if (result[meas.EventStatus].ContainsKey(meas.TraceState))
                    {
                        result[meas.EventStatus][meas.TraceState]++;
                    }
                    else
                    {
                        result[meas.EventStatus].Add(meas.TraceState, 1);
                    }
                }
                else
                {
                    result.Add(meas.EventStatus, new Dictionary<FiberState, int> { { meas.TraceState, 1 } });
                }
            }
            return result;
        }

        public static bool IsEventForReport(this Measurement measurement, GetOpticalEventsReportPdfQuery query)
        {
            if (measurement.MeasurementTimestamp.Date < query.DateTimeFilter.SearchWindow!.Start) return false;
            if (measurement.MeasurementTimestamp.Date > query.DateTimeFilter.SearchWindow!.End) return false;
            if (!query.EventStatuses.Contains(measurement.EventStatus)) return false;
            return query.TraceStates.Contains(measurement.TraceState);
        }
    }
}