using GMap.NET;

namespace Iit.Fibertest.Graph;

public static class WebGisDtoFactory
{
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