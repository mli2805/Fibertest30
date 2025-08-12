using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record GetOpticalEventQuery(int EventId) : IRequest<OpticalEventDto>;

public class GetOpticalEventQueryHandler(TableProvider tableProvider)
    : IRequestHandler<GetOpticalEventQuery, OpticalEventDto>
{
    public Task<OpticalEventDto> Handle(GetOpticalEventQuery request, CancellationToken cancellationToken)
    {
        var result = tableProvider.GetOpticalEvent(request.EventId);
        return Task.FromResult(result);
    }
}
