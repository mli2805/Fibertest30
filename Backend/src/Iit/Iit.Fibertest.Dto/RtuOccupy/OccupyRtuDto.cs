using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class OccupyRtuDto
    {
        [DataMember]
        public string ClientIp { get; set; } = null!;

        [DataMember]
        public string ConnectionId { get; set; } = null!;

        [DataMember]
        public Guid RtuId { get; set; }

        [DataMember]
        public RtuOccupationState State { get; set; }

    }
}
