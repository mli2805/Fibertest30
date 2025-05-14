namespace Fibertest30.Application
{
    public class FiberInfo
    {
        public Guid FiberId;
        public double GpsLength;
        public double UserInputedLength;

        public List<OpticalLength> TracesThrough = new List<OpticalLength>();
        public bool HasTraceUnderMonitoring;
    }

    public record OpticalLength(Guid TraceId, double Length);
}
