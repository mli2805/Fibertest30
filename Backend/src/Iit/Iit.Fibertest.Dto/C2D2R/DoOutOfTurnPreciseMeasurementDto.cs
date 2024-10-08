﻿using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class DoOutOfTurnPreciseMeasurementDto
    {
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public string ConnectionId { get; set; } = null!;
        [DataMember]
        public string ClientIp { get; set; } = null!;

        [DataMember]
        public Guid RtuId { get; set; }

        [DataMember]
        public RtuMaker RtuMaker { get; set; }

        [DataMember]
        public PortWithTraceDto PortWithTraceDto { get; set; } = null!;

        [DataMember]
        public bool IsTrapCaused { get; set; } // false means user's measurement
    }
}