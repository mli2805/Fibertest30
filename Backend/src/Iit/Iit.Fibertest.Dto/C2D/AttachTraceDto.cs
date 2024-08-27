using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class AttachTraceDto
    {
        [DataMember]
        public string ClientIp { get; set; } = null!;

        [DataMember]
        public string ConnectionId { get; set; } = null!;

        [DataMember]
        public string Username { get; set; } = null!;

        [DataMember]
        public RtuMaker RtuMaker { get; set; }

        [DataMember]
        public Guid TraceId { get; set; }

        [DataMember] 
        public OtauPortDto OtauPortDto { get; set; } = null!; // if trace attached to main otau use only this property

        [DataMember]
        public OtauPortDto? MainOtauPortDto { get; set; } // veex cannot measure bop without this, use it if trace attached to bop

    }
}