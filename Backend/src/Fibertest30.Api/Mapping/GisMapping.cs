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
        return new TraceNode()
        {
            Id = node.Id.ToString(),
            Title = node.Title,
            Coors = node.Coors.ToProto(),
            EquipmentType = node.EquipmentType.ToProto()
        };
    }

    private static GeoFiber ToProto(this FiberGisData fiber)
    {
        return new GeoFiber()
        {
            Id = fiber.Id.ToString(),
            Coors1 = fiber.Coors1.ToProto(),
            Coors2 = fiber.Coors2.ToProto(),
            FiberState = fiber.FiberState.ToProto(),
        };
    }

    public static TraceRouteData ToProto(this TraceGisData trace)
    {
        var result = new TraceRouteData { TraceState = trace.TraceState.ToProto() };
        trace.Nodes.ForEach(n => result.Nodes.Add(n.ToProto()));
        return result;
    }

    public static GraphRoutesData ToProto(this GisData data)
    {
        var result = new GraphRoutesData();
        data.Traces.ForEach(t=>result.Traces.Add(t.ToProto()));
        return result;
    }

    public static AllGeoData ToProto(this AllGisData data)
    {
        var result = new AllGeoData();
        data.Fibers.ForEach(f=>result.Fibers.Add(f.ToProto()));
        data.Nodes.ForEach(n=>result.Nodes.Add(n.ToProto()));
        return result;
    }
}