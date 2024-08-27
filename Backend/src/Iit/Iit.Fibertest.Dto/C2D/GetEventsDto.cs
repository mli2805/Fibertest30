using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class GetEventsDto
    {
        [DataMember]
        public int Revision { get; set; }

        [DataMember]
        public string ConnectionId { get; set; } = null!;

        [DataMember]
        public string ClientIp { get; set; } = null!;
    }
}