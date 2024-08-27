using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class ClientMeasurementResultDto
    {
        [DataMember]
        public string ClientIp { get; set; } = null!;
        [DataMember]
        public string ConnectionId { get; set; } = null!;

        [DataMember]
        public ReturnCode ReturnCode { get; set; }

        [DataMember]
        public byte[] SorBytes { get; set; }

        [DataMember]
        public Guid ClientMeasurementId { get; set; }

        [DataMember]
        public OtauPortDto OtauPortDto { get; set; }
    }

  
}