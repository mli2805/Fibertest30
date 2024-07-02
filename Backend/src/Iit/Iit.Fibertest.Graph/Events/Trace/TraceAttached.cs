﻿using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class TraceAttached
    {
        public Guid TraceId { get; set; }
        public OtauPortDto OtauPortDto { get; set; }

        public FiberState PreviousTraceState { get; set; }
        public List<AccidentOnTraceV2> AccidentsInLastMeasurement { get; set; }
    }
}
