using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class UnRegisterClientDto
    {
        [DataMember] public string Username { get; set; } = null!;
        [DataMember]
        public string ConnectionId { get; set; } = null!;
        [DataMember]
        public string ClientIp { get; set; } = null!;
    }
}