﻿using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class GponPortRelation
    {
        // public Guid Id { get; set; }
        public Guid TceId { get; set; }
        public int SlotPosition { get; set; }
        public int GponInterface { get; set; }
        public Guid RtuId { get; set; }
        public RtuMaker RtuMaker { get; set; }
        public OtauPortDto OtauPortDto { get; set; }
        public Guid TraceId { get; set; }
    }
}