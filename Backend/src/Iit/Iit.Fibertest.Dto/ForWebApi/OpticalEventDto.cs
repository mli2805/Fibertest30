using GMap.NET;

namespace Iit.Fibertest.Dto
{
    public class OpticalEventDto
    {
        public int EventId;
        public DateTime MeasurementTimestamp;
        public DateTime EventRegistrationTimestamp;
        public string RtuTitle;
        public Guid RtuId;

        public Guid TraceId;
        public string TraceTitle;

        public BaseRefType BaseRefType;
        public FiberState TraceState;

        public EventStatus EventStatus;
        public DateTime StatusChangedTimestamp;
        public string StatusChangedByUser;

        public string Comment;

        // public List<AccidentLineDto> Accidents;
        public List<AccidentOnTraceV2Dto> Accidents;
    }

    public class AccidentOnTraceV2Dto
    {
        public int BrokenRftsEventNumber;

        public FiberState AccidentSeriousness;
        public OpticalAccidentType OpticalTypeOfAccident;
        
        public bool IsAccidentInOldEvent;
        public bool IsAccidentInLastNode;
        public PointLatLng AccidentCoors;

        public int AccidentLandmarkIndex;
        public double AccidentToRtuOpticalDistanceKm;
        public string AccidentTitle = string.Empty;
        public double AccidentToRtuPhysicalDistanceKm;

        public double AccidentToLeftOpticalDistanceKm;
        public double AccidentToLeftPhysicalDistanceKm;
        public double AccidentToRightOpticalDistanceKm;
        public double AccidentToRightPhysicalDistanceKm;

        public string EventCode = string.Empty;
        public double DeltaLen;

        public AccidentNeighbourDto? Left;
        public AccidentNeighbourDto? Right;
    }
}