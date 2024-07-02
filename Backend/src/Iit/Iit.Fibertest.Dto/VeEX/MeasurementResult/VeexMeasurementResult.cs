﻿
// ReSharper disable InconsistentNaming

namespace Iit.Fibertest.Dto
{
    public class VeexMeasurementResult
    {
        public List<ConnectionQuality> connectionQualities { get; set; }
        public string id { get; set; }
        public LinkObject report { get; set; }
        public string status { get; set; }
        public string extendedStatus { get; set; }
        public Failure failure { get; set; }
        public LinkObject traces { get; set; }
    }
}