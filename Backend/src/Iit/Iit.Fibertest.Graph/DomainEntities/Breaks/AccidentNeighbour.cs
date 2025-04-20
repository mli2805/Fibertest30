using GMap.NET;

namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class AccidentNeighbour
    {
        public int LandmarkIndex { get; set; }
        public string Title { get; set; } = string.Empty;
        public PointLatLng Coors { get; set; }
        public double ToRtuOpticalDistanceKm { get; set; }
        public double ToRtuPhysicalDistanceKm { get; set; }
    }
}