namespace Iit.Fibertest.Graph;

public static class WebGisDtoFactory
{
    public static AllGisData GetAllGisData(this Model writeModel)
    {
        return new AllGisData()
        {
            Nodes = writeModel
                .Nodes.Select(node => node.GetNodeGisData()).ToList(),
            Fibers = writeModel.Fibers.Select(fiber => new FiberGisData()
                {
                    Id = fiber.FiberId,
                    Node1Id = fiber.NodeId1,
                    Coors1 = writeModel.Nodes.First(n => n.NodeId == fiber.NodeId1).Position,
                    Node2Id = fiber.NodeId2,
                    Coors2 = writeModel.Nodes.First(n => n.NodeId == fiber.NodeId2).Position,
                    FiberState = fiber.GetState()
                })
                .ToList()
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