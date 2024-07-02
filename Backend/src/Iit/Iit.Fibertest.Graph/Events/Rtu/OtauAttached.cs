﻿using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class OtauAttached
    {
        public Guid Id { get; set; }
        public Guid RtuId { get; set; }

        public NetAddress NetAddress { get; set; } = new NetAddress();
        public string Serial { get; set; }
        public int PortCount { get; set; }

        public int MasterPort { get; set; }
        public bool IsOk { get; set; }
    }
}
