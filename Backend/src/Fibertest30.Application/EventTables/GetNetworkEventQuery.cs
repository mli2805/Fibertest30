using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record GetNetworkEventQuery(int EventId): IRequest<NetworkEventDto>;

public class GetNetworkEventQueryHandler(TableProvider tableProvider)
    : IRequestHandler<GetNetworkEventQuery, NetworkEventDto>
{
    public Task<NetworkEventDto> Handle(GetNetworkEventQuery request, CancellationToken cancellationToken)
    {
        var result = tableProvider.GetNetworkEvent(request.EventId);
        return Task.FromResult(result);
    }
}