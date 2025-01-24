using Iit.Fibertest.Graph;
using MediatR;
using System.Text.Json;

namespace Fibertest30.Application;

public record GraphCommand(string Command, string CommandType) : IRequest<string?>;

public class GraphCommandHandler(ICurrentUserService currentUserService, IEventStoreService eventStoreService)
    : IRequestHandler<GraphCommand, string?>
{
    public async Task<string?> Handle(GraphCommand request, CancellationToken cancellationToken)
    {
        var cmd = Des(request.Command, request.CommandType);
        if (cmd == null)
        {
            throw new ArgumentException("Failed deserialize command");
        }

        return await eventStoreService.SendCommand(cmd, currentUserService.UserName, "");
    }

    private object? Des(string json, string typeName)
    {
        switch (typeName)
        {
            case "UpdateRtu": return JsonSerializer.Deserialize<UpdateRtu>(json);
            case "UpdateTrace": return JsonSerializer.Deserialize<UpdateTrace>(json);

            case "AddEquipmentAtGpsLocation": return  JsonSerializer.Deserialize<AddEquipmentAtGpsLocation>(json);
        }

        return null;
    }
}
