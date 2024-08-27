﻿using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class ApplyMonitoringSettingsDto
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
        public string OtdrId { get; set; }

        [DataMember]
        // public string OtauId { get; set; }
        public VeexOtau MainVeexOtau { get; set; } = new VeexOtau(); // in Veex RTU it is a separate unit

        [DataMember]
        public bool IsMonitoringOn { get; set; }

        [DataMember]
        public MonitoringTimespansDto Timespans { get; set; }

        [DataMember]
        public List<PortWithTraceDto> Ports { get; set; }
    }
}