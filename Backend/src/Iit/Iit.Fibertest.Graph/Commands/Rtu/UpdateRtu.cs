using GMap.NET.Core;

namespace Iit.Fibertest.Graph
{
    public class UpdateRtu
    {
        public Guid RtuId { get; set; }
        public string Title { get; set; }

        public PointLatLng Position { get; set; }
        public string Comment { get; set; }
    }
}
