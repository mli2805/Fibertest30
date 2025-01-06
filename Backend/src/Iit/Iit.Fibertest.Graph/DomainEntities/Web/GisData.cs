using GMap.NET;
using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph;

public class NodeGisData
{
    public Guid Id;
    public string Title = null!;
    public PointLatLng Coors;
    public EquipmentType EquipmentType;
}

public class TraceGisData
{
    public List<NodeGisData> Nodes = null!;
    public FiberState TraceState;
}

public class GisData
{
    public List<TraceGisData> Traces = null!;
}
