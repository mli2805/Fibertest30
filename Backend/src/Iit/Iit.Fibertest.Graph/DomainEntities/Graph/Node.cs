﻿using GMap.NET;
using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class Node
    {
        public Guid NodeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public EquipmentType TypeOfLastAddedEquipment { get; set; }
        public FiberState State { get; set; }
        public PointLatLng Position { get; set; }
        public string Comment { get; set; } = string.Empty;

        public Guid AccidentOnTraceId { get; set; }

        public bool IsHighlighted
        {
            get; 
            set;
        }
    }
}