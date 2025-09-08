using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;

namespace Fibertest30.Application
{
    public class MeasurementWrap(Measurement measurement, string traceTitle)
    {
        public Measurement Measurement { get; set; } = measurement;
        public string TraceTitle { get; set; } = traceTitle;

        public DateTime? OkAt { get; set; }
    }


    public static class MeasurementWrapExt
    {
        public static MeasurementWrap WrapMeasurement(this Model model, Measurement measurement, bool searchOk)
        {
            var trace = model.Traces.FirstOrDefault(t => t.TraceId == measurement.TraceId);
            var wrap = new MeasurementWrap(measurement, trace?.Title ?? " - ");

            if (searchOk)
            {
                var okEvent = model.Measurements.FirstOrDefault(e =>
                    e.TraceId == measurement.TraceId && e.TraceState == FiberState.Ok
                                                     && e.MeasurementTimestamp >= measurement.MeasurementTimestamp);

                if (okEvent != null)
                    wrap.OkAt = okEvent.MeasurementTimestamp;
            }

            return wrap;
        }
    }
}
