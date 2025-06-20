using Iit.Fibertest.Graph;
using MediatR;
using Microsoft.Extensions.Logging;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Fibertest30.Application;

public record GraphCommand(string Command, string CommandType) : IRequest<string?>;

public class GraphCommandHandler(ILogger<GraphCommand> logger, ICurrentUserService currentUserService, 
    IRtuStationsRepository rtuStationsRepository, IBaseRefRepairman baseRefRepairman,
        IEventStoreService eventStoreService, ISystemEventSender systemEventSender, Model writeModel)
    : IRequestHandler<GraphCommand, string?>
{
    public async Task<string?> Handle(GraphCommand request, CancellationToken cancellationToken)
    {
        var cmd = Deserialize(request.Command, request.CommandType);
        if (cmd == null)
        {
            throw new ArgumentException("Failed deserialize command");
        }

        var result = await eventStoreService.SendCommand(cmd, currentUserService.UserName, "");
        if (!string.IsNullOrEmpty(result))
        {
            logger.LogError(result);
            throw new GraphException(result);
        }

        var postProcessingResult = await PostProcessing(cmd);
        if (!string.IsNullOrEmpty(postProcessingResult))
        {
            logger.LogError(result);
            throw new GraphException(postProcessingResult);
        }

        var systemEvent = Create(cmd);
        if (systemEvent != null)
            await systemEventSender.Send(systemEvent);
        return null;
    }

    // только для классов из Iit.Fibertest.Graph
    private object? Deserialize(string json, string typeName)
    {
        var a = typeof(UpdateRtu).Assembly;
        var type = a.GetTypes().FirstOrDefault(t => t.FullName == $"Iit.Fibertest.Graph.{typeName}");
        return type != null ? JsonSerializer.Deserialize(json, type) : null;
    }

    private SystemEvent? Create(object cmd)
    {
        return cmd switch
        {
            AddTrace c => SystemEventFactory
                .TraceAdded(currentUserService.UserId!, c.TraceId,
                    writeModel.Traces.First(t => t.TraceId == c.TraceId).RtuId),
            CleanTrace c => SystemEventFactory.TraceCleaned(currentUserService.UserId!, c.TraceId),
            RemoveTrace c => SystemEventFactory.TraceRemoved(currentUserService.UserId!, c.TraceId),
            AddRtuAtGpsLocation c => SystemEventFactory.RtuAdded(currentUserService.UserId!, c.Id),
            UpdateRtu c => SystemEventFactory.RtuUpdated(currentUserService.UserId!, c.RtuId),
            RemoveRtu c => SystemEventFactory.RtuRemoved(currentUserService.UserId!, c.RtuId),

            _ => null
        };
    }

    private async Task<string?> PostProcessing(object cmd)
    {
        if (cmd is RemoveRtu removeRtu)
            return await rtuStationsRepository.RemoveRtuAsync(removeRtu.RtuId);

        #region Base ref amend
        if (cmd is UpdateAndMoveNode updateAndMoveNode)
            return await baseRefRepairman.AmendForTracesWhichUseThisNode(updateAndMoveNode.NodeId);
        if (cmd is UpdateRtu updateRtu)
            return await baseRefRepairman.AmendForTracesFromRtu(updateRtu.RtuId);
        if (cmd is UpdateNode updateNode)
            return await baseRefRepairman.AmendForTracesWhichUseThisNode(updateNode.NodeId);
        if (cmd is MoveNode moveNode)
            return await baseRefRepairman.AmendForTracesWhichUseThisNode(moveNode.NodeId);
        if (cmd is UpdateEquipment updateEquipment)
            return await baseRefRepairman.ProcessUpdateEquipment(updateEquipment.EquipmentId);
        if (cmd is UpdateFiber updateFiber)
            return await baseRefRepairman.ProcessUpdateFiber(updateFiber.Id);
        if (cmd is AddNodeIntoFiber addNodeIntoFiber)
            return await baseRefRepairman.AmendForTracesWhichUseThisNode(addNodeIntoFiber.Id);
        if (cmd is RemoveNode removeNode && removeNode.IsAdjustmentPoint)
            return await baseRefRepairman.ProcessNodeRemoved(removeNode.DetoursForGraph.Select(d => d.TraceId)
                .ToList());
        #endregion

        return null;
    }

}



