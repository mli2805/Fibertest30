﻿using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    public class RequestAddEquipmentAtGpsLocation
    {
        public EquipmentType Type { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}