using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record GetOpticalEventQuery(int EventId) : IRequest<OpticalEventDto>;

public class GetOpticalEventQueryHandler : IRequestHandler<GetOpticalEventQuery, OpticalEventDto>
{
    private readonly TableProvider _tableProvider;

    public GetOpticalEventQueryHandler(TableProvider tableProvider)
    {
        _tableProvider = tableProvider;
    }

    public Task<OpticalEventDto> Handle(GetOpticalEventQuery request, CancellationToken cancellationToken)
    {
        var result = _tableProvider.GetOpticalEvent(request.EventId);
        return Task.FromResult(result);
    }
}
