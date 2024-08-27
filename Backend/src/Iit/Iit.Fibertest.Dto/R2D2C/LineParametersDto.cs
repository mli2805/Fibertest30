using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class LineParametersDto
    {
        [DataMember]
        public string ClientIp { get; set; } = null!;
        [DataMember]
        public string ConnectionId { get; set; } = null!;

        [DataMember]
        public ReturnCode ReturnCode { get; set; }

        [DataMember]
        public ConnectionQuality ConnectionQuality { get; set; }
    }
}