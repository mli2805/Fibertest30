﻿using Iit.Fibertest.Dto;
// ReSharper disable InconsistentNaming

namespace Iit.Fibertest.Graph
{
    public class NetworkEventAdded
    {
        public int Ordinal { get; set; }

        public DateTime EventTimestamp { get; set; }
        public Guid RtuId { get; set; }
        public ChannelEvent OnMainChannel { get; set; }
        public ChannelEvent OnReserveChannel { get; set; }
    }
}