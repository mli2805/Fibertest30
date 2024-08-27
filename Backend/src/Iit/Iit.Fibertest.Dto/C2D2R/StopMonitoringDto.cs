using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class StopMonitoringDto
    {
        [DataMember]
        public string ClientIp { get; set; } = null!;

        [DataMember]
        public string ConnectionId { get; set; } = null!;

        [DataMember]
        public Guid RtuId { get; set; }

        [DataMember]
        public RtuMaker RtuMaker { get; set; }
    }
}