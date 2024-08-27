using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class TraceDto : ChildDto
    {
        [DataMember] public Guid TraceId;
        [DataMember] public Guid RtuId;
        [DataMember] public string Title = null!;
        [DataMember] public OtauPortDto? OtauPort;
        [DataMember] public bool IsAttached;

        [DataMember] public FiberState State;

        [DataMember] public bool HasEnoughBaseRefsToPerformMonitoring;
        [DataMember] public bool IsIncludedInMonitoringCycle;
        [DataMember] public TraceToTceLinkState TceLinkState = TraceToTceLinkState.NoLink;

        public TraceDto(ChildType childType) : base(childType)
        {
        }
    }
}