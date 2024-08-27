﻿using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class PrepareReflectMeasurementDto
    {
        [DataMember]
        public string ConnectionId { get; set; } = null!;
        [DataMember]
        public string ClientIp { get; set; } = null!;

        [DataMember]
        public Guid RtuId { get; set; }

        [DataMember]
        public OtauPortDto OtauPortDto { get; set; } = null!;

        [DataMember]
        public OtauPortDto? MainOtauPortDto { get; set; } // optional, filled in if trace attached to the child otau

        [DataMember]
        public string? OtdrId { get; set; }
    }
}