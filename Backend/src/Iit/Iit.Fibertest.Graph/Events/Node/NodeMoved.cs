﻿namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class NodeMoved
    {
        public Guid NodeId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
