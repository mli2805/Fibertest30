﻿using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    public class MeasurementAdded
    {
        public ReturnCode ReturnCode { get; set; }
        public int SorFileId { get; set; }

        public DateTime MeasurementTimestamp { get; set; }
        public DateTime EventRegistrationTimestamp { get; set; }
        public Guid RtuId { get; set; }
        public Guid TraceId { get; set; }
        public BaseRefType BaseRefType { get; set; }
        public FiberState TraceState { get; set; }

        public EventStatus EventStatus { get; set; }
        public DateTime StatusChangedTimestamp { get; set; }
        public string StatusChangedByUser { get; set; }

        public string Comment { get; set; }
        public List<AccidentOnTraceV2> Accidents { get; set; }
    }
}