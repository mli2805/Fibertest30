using Iit.Fibertest.Graph;
using MediatR;
using System.Reflection;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Fibertest30.Application;

public record GraphCommand(string Command, string CommandType) : IRequest<string?>;

public class GraphCommandHandler(ICurrentUserService currentUserService, IEventStoreService eventStoreService)
    : IRequestHandler<GraphCommand, string?>
{
    public async Task<string?> Handle(GraphCommand request, CancellationToken cancellationToken)
    {
        var cmd = Deserialize(request.Command, request.CommandType);
        if (cmd == null)
        {
            throw new ArgumentException("Failed deserialize command");
        }

        return await eventStoreService.SendCommand(cmd, currentUserService.UserName, "");
    }

 

    // только для классов из Iit.Fibertest.Graph
    private object? Deserialize(string json, string typeName)
    {
        var a = typeof(UpdateRtu).Assembly;
        var type = a.GetTypes().FirstOrDefault(t => t.FullName == $"Iit.Fibertest.Graph.{typeName}");
        return type != null ? JsonSerializer.Deserialize(json, type) : null;
    }

}



