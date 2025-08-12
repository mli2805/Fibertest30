using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record GetBopEventQuery(int EventId): IRequest<BopEventDto>;

public class GetBopEventQueryHandler(TableProvider tableProvider) : IRequestHandler<GetBopEventQuery, BopEventDto>
{
    public Task<BopEventDto> Handle(GetBopEventQuery request, CancellationToken cancellationToken)
    {
        var result = tableProvider.GetBopEvent(request.EventId);
        return Task.FromResult(result);
    }
}