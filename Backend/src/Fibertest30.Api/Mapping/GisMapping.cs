using GMap.NET;
using Iit.Fibertest.Graph;

namespace Fibertest30.Api;

public static class GisMapping
{
    private static EquipmentType ToProto(this Iit.Fibertest.Dto.EquipmentType type)
    {
        return type switch
        {
            Iit.Fibertest.Dto.EquipmentType.AdjustmentPoint => EquipmentType.AdjustmentPoint,
            Iit.Fibertest.Dto.EquipmentType.EmptyNode => EquipmentType.EmptyNode,
            Iit.Fibertest.Dto.EquipmentType.CableReserve => EquipmentType.CableReserve,
            Iit.Fibertest.Dto.EquipmentType.Other => EquipmentType.Other,
            Iit.Fibertest.Dto.EquipmentType.Closure => EquipmentType.Closure,
            Iit.Fibertest.Dto.EquipmentType.Cross => EquipmentType.Cross,
            Iit.Fibertest.Dto.EquipmentType.Well => EquipmentType.Well,
            Iit.Fibertest.Dto.EquipmentType.Terminal => EquipmentType.Terminal,
            Iit.Fibertest.Dto.EquipmentType.Rtu => EquipmentType.Rtu,
            Iit.Fibertest.Dto.EquipmentType.AccidentPlace => EquipmentType.AccidentPlace,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    private static GeoCoordinate ToProto(this PointLatLng point)
    {
        return new GeoCoordinate() { Latitude = point.Lat, Longitude = point.Lng };
    }

    private static TraceNode ToProto(this NodeGisData node)
    {
        TraceNode traceNode = new TraceNode()
        {
            Id = node.Id.ToString(),
            Title = node.Title,
            Coors = node.Coors.ToProto(),
            EquipmentType = node.EquipmentType.ToProto(),
            Comment = node.Comment,
        };
        return traceNode;
    }

    private static GeoEquipment ToProto(this EquipmentGisData equipment)
    {
        GeoEquipment geoEquipment = new GeoEquipment()
        {
            Id = equipment.Id.ToString(),
            Title = equipment.Title,
            NodeId = equipment.NodeId.ToString(),
            Type = equipment.Type.ToProto(),
            CableReserveLeft = equipment.CableReserveLeft,
            CableReserveRight = equipment.CableReserveRight,
            Comment = equipment.Comment
        };
        return geoEquipment;
    }

    private static GeoFiber ToProto(this FiberGisData fiber)
    {
        var result = new GeoFiber()
        {
            Id = fiber.Id.ToString(),
            Node1Id = fiber.Node1Id.ToString(),
            Coors1 = fiber.Coors1.ToProto(),
            Node2Id = fiber.Node2Id.ToString(),
            Coors2 = fiber.Coors2.ToProto(),
        };
        fiber.States.ForEach(s=>
        {
            result.States.Add(new FiberStateDictionaryItem
            {
                TraceId = s.Key.ToString(), TraceState = s.Value.ToProto()
            });
        });
        return result;
    }

    private static GeoTrace ToProto(this Iit.Fibertest.Graph.Trace trace)
    {
        var result = new GeoTrace()
        {
            Id = trace.TraceId.ToString(),
            Title = trace.Title,
            HasAnyBaseRef = trace.HasAnyBaseRef,
            State = trace.State.ToProto(),
            DarkMode = trace.Mode == TraceMode.Dark,
            Comment = trace.Comment ?? ""
        };
        trace.NodeIds.ForEach(n => result.NodeIds.Add(n.ToString()));
        trace.EquipmentIds.ForEach(n => result.EquipmentIds.Add(n.ToString()));
        trace.FiberIds.ForEach(n => result.FiberIds.Add(n.ToString()));
        return result;
    }

    public static TraceRouteData ToProto(this TraceGisData trace)
    {
        var result = new TraceRouteData
        {
            TraceId = trace.TraceId.ToString(),
            TraceState = trace.TraceState.ToProto()
        };
        trace.Nodes.ForEach(n => result.Nodes.Add(n.ToProto()));
        return result;
    }

    public static AllGeoData ToProto(this AllGisData data)
    {
        var result = new AllGeoData();
        data.Fibers.ForEach(f => result.Fibers.Add(f.ToProto()));
        data.Nodes.ForEach(n => result.Nodes.Add(n.ToProto()));
        data.Traces.ForEach(t => result.Traces.Add(t.ToProto()));
        data.Equipments.ForEach(e => result.Equipments.Add(e.ToProto()));
        return result;
    }
}