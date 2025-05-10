using GMap.NET;
using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph;

public class NodeGisData
{
    public Guid Id;
    public string Title = null!;
    public PointLatLng Coors;
    public EquipmentType EquipmentType;
    public string Comment = "";

    public FiberState State;
    public Guid AccidentOnTraceId;
}

public class EquipmentGisData
{
    public Guid Id;
    public Guid NodeId;
    public string Title = null!;
    public EquipmentType Type;
    public int CableReserveLeft;
    public int CableReserveRight;
    public string Comment = "";

}

public class FiberGisData
{
    public Guid Id;
    public Guid Node1Id;
    public PointLatLng Coors1;
    public Guid Node2Id;
    public PointLatLng Coors2;
    public Dictionary<Guid, FiberState> States = null!;
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
    public List<EquipmentGisData> Equipments = null!;
    public List<NodeGisData> Nodes = null!;
    public List<Trace> Traces = null!;
}
