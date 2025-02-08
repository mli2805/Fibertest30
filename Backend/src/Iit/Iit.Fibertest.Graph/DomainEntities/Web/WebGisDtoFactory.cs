namespace Iit.Fibertest.Graph;

public static class WebGisDtoFactory
{
    public static AllGisData GetAllGisData(this Model writeModel)
    {
        return new AllGisData()
        {
            Nodes = writeModel
                .Nodes.Select(node => node.GetNodeGisData()).ToList(),
            Fibers = writeModel
                .Fibers.Select(f=>f.GetFiberGisData(writeModel)).ToList()!
        };
    }

    public static AllGisData GetAllReadOnly(this Model writeModel)
    {
        var nodeIds = new List<Guid>();
        var fiberIds = new List<Guid>();
        foreach (var trace in writeModel.Traces)
        {
            nodeIds = nodeIds.Union(trace.NodeIds).ToList();
            fiberIds = fiberIds.Union(trace.FiberIds).ToList();
        }

        return new AllGisData()
        {
            Nodes = nodeIds
                .Select(id => writeModel.Nodes.First(n => n.NodeId == id))
                .Select(node => node.GetNodeGisData()).ToList(),
            Fibers = fiberIds
                .Select(id => writeModel.Fibers.First(f=>f.FiberId == id))
                .Select(fiber=>fiber.GetFiberGisData(writeModel))
                .Where(fiberGisData => fiberGisData != null).ToList()!
        };
    }

    //
    public static TraceGisData GetTraceGisData(this Model writeModel, Guid traceId)
    {
        var trace = writeModel.Traces.First(t => t.TraceId == traceId);
        return writeModel.GetTraceGisData(trace);
    }

    public static GisData GetGisData(this Model writeModel)
    {
        return new GisData() { Traces = writeModel.Traces.Select(writeModel.GetTraceGisData).ToList() };
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
            EquipmentType = node.TypeOfLastAddedEquipment
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
                FiberState = fiber.GetState()
            };
        }
        else
        {
            Console.WriteLine($@"bad fiber {fiber.FiberId}");
            return null;
        }
    }
}