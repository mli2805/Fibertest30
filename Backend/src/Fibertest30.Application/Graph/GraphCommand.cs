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

        await SendSystemEvent(cmd);
        return null;
    }

    // только для классов из Iit.Fibertest.Graph
    private object? Deserialize(string json, string typeName)
    {
        var a = typeof(UpdateRtu).Assembly;
        var type = a.GetTypes().FirstOrDefault(t => t.FullName == $"Iit.Fibertest.Graph.{typeName}");
        return type != null ? JsonSerializer.Deserialize(json, type) : null;
    }

    private async Task SendSystemEvent(object cmd)
    {
        SystemEvent systemEvent;
        switch (cmd)
        {
            case AddTrace c:
                var trace = writeModel.Traces.First(t => t.TraceId == c.TraceId);
                systemEvent = SystemEventFactory.TraceAdded(currentUserService.UserId!, c.TraceId, trace.RtuId);
                await systemEventSender.Send(systemEvent);
                break;
            case CleanTrace c:
                systemEvent = SystemEventFactory.TraceCleaned(currentUserService.UserId!, c.TraceId);
                await systemEventSender.Send(systemEvent);
                break;
            case RemoveTrace c:
                systemEvent = SystemEventFactory.TraceRemoved(currentUserService.UserId!, c.TraceId);
                await systemEventSender.Send(systemEvent);
                break;
        }


    }

}



