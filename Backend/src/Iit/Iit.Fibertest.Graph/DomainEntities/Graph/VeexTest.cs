﻿using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class VeexTest
    {
        public Guid TestId { get; set; }
        public Guid TraceId { get; set; }
        public BaseRefType BasRefType { get; set; }

        public bool IsOnBop { get; set; }
        public string OtauId { get; set; }

        public DateTime CreationTimestamp { get; set; }

    }
}