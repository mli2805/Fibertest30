using Iit.Fibertest.Graph;
using MediatR;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Fibertest30.Application;

public record GraphCommand(string Command, string CommandType) : IRequest<string?>;

public class GraphCommandHandler(ICurrentUserService currentUserService,
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
            throw new GraphException(result);
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

}



