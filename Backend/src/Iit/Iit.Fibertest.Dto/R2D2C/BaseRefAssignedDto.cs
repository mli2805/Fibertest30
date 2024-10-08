﻿using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class BaseRefAssignedDto : RequestAnswer
    {
        [DataMember]
        public BaseRefType BaseRefType { get; set; } // type of base ref where error happened
       
        [DataMember]
        public int Landmarks { get; set; }
        [DataMember]
        public int Nodes { get; set; }
        [DataMember]
        public int Equipments { get; set; }
        [DataMember]
        public string? WaveLength { get; set; }

        [DataMember]
        public List<VeexTestCreatedDto> AddVeexTests { get; set; } = new List<VeexTestCreatedDto>();
        [DataMember]
        public List<Guid> RemoveVeexTests { get; set; } = new List<Guid>();

        public BaseRefAssignedDto() {}

        public BaseRefAssignedDto(ReturnCode returnCode) : base(returnCode) {}
    }
}