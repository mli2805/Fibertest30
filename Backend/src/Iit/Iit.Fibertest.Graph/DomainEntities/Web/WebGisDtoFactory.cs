namespace Iit.Fibertest.Graph;

public static class WebGisDtoFactory
{
    public static AllGisData GetAllGisData(this Model writeModel)
    {
        var nodeDict = writeModel
            .Nodes.Select(node => node.GetNodeGisData()).ToDictionary(x => x.Id, x => x);

        var fibers = new List<FiberGisData>();
        foreach (Fiber fiber in writeModel.Fibers)
        {
                fibers.Add(new FiberGisData()
                {
                    Id = fiber.FiberId,
                    Coors1 = writeModel.Nodes.First(n => n.NodeId == fiber.NodeId1).Position,
                    Coors2 = writeModel.Nodes.First(n => n.NodeId == fiber.NodeId2).Position,
                    FiberState = fiber.GetState()
                });

            nodeDict[fiber.NodeId1].FiberIds.Add(fiber.FiberId);
            nodeDict[fiber.NodeId2].FiberIds.Add(fiber.FiberId);
        }

        return new AllGisData()
        {
            Nodes = nodeDict.Values.ToList(),
            Fibers = fibers
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