using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class DetachTraceDto
    {
        [DataMember] 
        public string ConnectionId { get; set; } = string.Empty;
        [DataMember]
        public Guid TraceId { get; set; }
    }
}