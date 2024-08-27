using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class CheckServerConnectionDto
    {
        [DataMember]
        public string ClientIp { get; set; } = string.Empty;
        [DataMember]
        public string ConnectionId { get; set; } = string.Empty;
    }
}