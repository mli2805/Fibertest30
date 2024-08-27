using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class FreeOtdrDto
    {
        [DataMember]
        public string ClientIp { get; set; } = null!;
        [DataMember]
        public string ConnectionId { get; set; } = null!;
        [DataMember]
        public Guid RtuId { get; set; }
    }
}