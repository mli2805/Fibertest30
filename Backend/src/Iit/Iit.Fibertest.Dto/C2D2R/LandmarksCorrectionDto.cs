using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class LandmarksCorrectionDto
    {
        [DataMember]
        public string ClientIp { get; set; } = null!;
        [DataMember]
        public string ConnectionId { get; set; } = null!;
        
        [DataMember]
        public Guid BatchId { get; set; }
        [DataMember]
        public List<string> Corrections { get; set; } = new List<string>();
    }
}