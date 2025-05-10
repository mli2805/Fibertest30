using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph;

public static class WebGisDtoFactory
{
    public static AllGisData GetAllGisData(this Model writeModel)
    {
        var aaa = writeModel.Nodes.Where(n => n.TypeOfLastAddedEquipment == EquipmentType.AccidentPlace).ToList();

        return new AllGisData()
        {
            Nodes = writeModel
                .Nodes.Select(node => node.GetNodeGisData()).ToList(),
            Equipments = writeModel.Equipments
                .Select(e => e.GetEquipmentGisData()).Union(writeModel.Rtus.Select(r=>r.GetRtuAsEquipmentGisData())).ToList(),
            Fibers = writeModel
                .Fibers.Select(f => f.GetFiberGisData(writeModel))
                .Where(fiberGisData => fiberGisData != null).ToList()!,
            Traces = writeModel.Traces
        };
    }

    public static AllGisData GetAllReadOnly(this Model writeModel)
    {
        var nodeIds = writeModel.Rtus.Select(r=>r.NodeId).ToList();
        var fiberIds = new List<Guid>();
        
        foreach (var trace in writeModel.Traces)
        {
            nodeIds = nodeIds.Union(trace.NodeIds).ToList();
            fiberIds = fiberIds.Union(trace.FiberIds).ToList();
        }

        // находит какой-то мусор, приходится делать FirstOrDefault и фильтровать
        IEnumerable<Node> nodes = nodeIds
            .Select(id => writeModel.Nodes.FirstOrDefault(n => n.NodeId == id)).Where(r=>r!=null).ToList()!;
        List<NodeGisData> nodeGisDatas = nodes
            .Select(node => node.GetNodeGisData()).ToList();

        List<EquipmentGisData> equipmentGisDatas = writeModel.Equipments
            .Select(e => e.GetEquipmentGisData()).Union(writeModel.Rtus.Select(r=>r.GetRtuAsEquipmentGisData())).ToList();


        // находит какой-то мусор, приходится делать FirstOrDefault и фильтровать
        IEnumerable<Fiber> fibers = fiberIds
            .Select(id => writeModel.Fibers.FirstOrDefault(f => f.FiberId == id)).Where(r=>r!=null)!;
        List<FiberGisData> fiberGisDatas = fibers
            .Select(fiber => fiber.GetFiberGisData(writeModel))
            .Where(fiberGisData => fiberGisData != null).ToList()!;

        return new AllGisData()
        {
            Nodes = nodeGisDatas,
            Equipments = equipmentGisDatas,
            Fibers = fiberGisDatas,
            Traces = writeModel.Traces
        };
    }
    
    //
    public static TraceGisData GetTraceGisData(this Model writeModel, Guid traceId)
    {
        var trace = writeModel.Traces.First(t => t.TraceId == traceId);
        return writeModel.GetTraceGisData(trace);
    }

    private static TraceGisData GetTraceGisData(this Model writeModel, Trace trace)
    {
        return new TraceGisData()
        {
            TraceId = trace.TraceId,
            TraceState = trace.State,
            Nodes = trace.NodeIds
                .Select(nodeId => writeModel.Nodes.First(n => n.NodeId == nodeId).GetNodeGisData())
                .ToList(),
        };
    }

    private static NodeGisData GetNodeGisData(this Node node)
    {
        return new NodeGisData()
        {
            Id = node.NodeId,
            Title = node.Title ?? "",
            Coors = node.Position,
            EquipmentType = node.TypeOfLastAddedEquipment,
            Comment = node.Comment ?? "",

            State = node.State,
            AccidentOnTraceId = node.AccidentOnTraceId,
        };
    }

    private static EquipmentGisData GetEquipmentGisData(this Equipment equipment)
    {
        return new EquipmentGisData()
        {
            Id = equipment.EquipmentId,
            NodeId = equipment.NodeId,
            Title = equipment.Title ?? "",
            Type = equipment.Type,
            CableReserveLeft = equipment.CableReserveLeft,
            CableReserveRight = equipment.CableReserveRight,
            Comment = equipment.Comment ?? ""
        };
    }

    private static EquipmentGisData GetRtuAsEquipmentGisData(this Rtu rtu)
    {
        return new EquipmentGisData()
        {
            Id = rtu.Id,
            NodeId = rtu.NodeId,
            Title = rtu.Title ?? "",
            Type = EquipmentType.Rtu,
            CableReserveLeft = 0,
            CableReserveRight = 0,
            Comment = rtu.Comment ?? ""
        };
    }

    private static FiberGisData? GetFiberGisData(this Fiber fiber, Model writeModel)
    {
        var node1 = writeModel.Nodes.FirstOrDefault(n => n.NodeId == fiber.NodeId1);
        var node2 = writeModel.Nodes.FirstOrDefault(n => n.NodeId == fiber.NodeId2);
        if (node1 != null && node2 != null)
        {
            return new FiberGisData()
            {
                Id = fiber.FiberId,
                Node1Id = fiber.NodeId1,
                Coors1 = node1.Position,
                Node2Id = fiber.NodeId2,
                Coors2 = node2.Position,
                States = fiber.States,
                TracesWithExceededLossCoeff = fiber.TracesWithExceededLossCoeff
            };
        }
        else
        {
            Console.WriteLine($@"bad fiber {fiber.FiberId}");
            return null;
        }
    }
}