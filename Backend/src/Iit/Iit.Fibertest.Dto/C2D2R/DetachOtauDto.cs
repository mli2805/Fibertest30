﻿using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class DetachOtauDto
    {
        [DataMember]
        public string ClientIp { get; set; } = null!;

        [DataMember]
        public string ConnectionId { get; set; } = null!;

        [DataMember]
        public Guid RtuId { get; set; }

        [DataMember]
        public RtuMaker RtuMaker { get; set; }

        [DataMember]
        public Guid OtauId { get; set; }

        [DataMember]
        public NetAddress NetAddress { get; set; } = null!;

        [DataMember]
        public int OpticalPort { get; set; }
    }
}