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

public class FiberGisData
{
    public Guid Id;
    public Guid Node1Id;
    public PointLatLng Coors1;
    public Guid Node2Id;
    public PointLatLng Coors2;
    public FiberState FiberState;
}

public class TraceGisData
{
    public Guid TraceId;
    public List<NodeGisData> Nodes = null!;
    public FiberState TraceState;
}

public class GisData
{
    public List<TraceGisData> Traces = null!;
}

public class AllGisData
{
    public List<FiberGisData> Fibers = null!;
    public List<NodeGisData> Nodes = null!;
}
