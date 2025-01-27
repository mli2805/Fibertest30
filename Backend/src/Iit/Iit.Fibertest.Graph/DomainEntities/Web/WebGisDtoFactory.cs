namespace Iit.Fibertest.Graph;

public static class WebGisDtoFactory
{
    public static AllGisData GetAllGisData(this Model writeModel)
    {
        List<NodeGisData> nodes = writeModel
            .Nodes.Select(node => node.GetNodeGisData()).ToList();

        List<FiberGisData> gisFibers = new List<FiberGisData>();
        foreach (Fiber fiber in writeModel.Fibers)
        {
            var node1 = writeModel.Nodes.FirstOrDefault(n => n.NodeId == fiber.NodeId1);
            var node2 = writeModel.Nodes.FirstOrDefault(n => n.NodeId == fiber.NodeId2);
            if (node1 != null && node2 != null)
            {
                gisFibers.Add(new FiberGisData()
                {
                    Id = fiber.FiberId,
                    Node1Id = fiber.NodeId1,
                    Coors1 = node1.Position,
                    Node2Id = fiber.NodeId2,
                    Coors2 = node2.Position,
                    FiberState = fiber.GetState()
                });
            }
            else
            {
                Console.WriteLine($@"bad fiber {fiber.FiberId}");
            }
        }

        return new AllGisData()
        {
            Nodes = nodes,
            Fibers = gisFibers
        };
    }

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
}