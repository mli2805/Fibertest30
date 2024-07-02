using MediatR;

namespace Fibertest30.Application;

public record GetSystemEventsQuery() : IRequest<List<SystemEvent>>;

public class GetSystemEventsQueryHandler : IRequestHandler<GetSystemEventsQuery, List<SystemEvent>>
{
    private readonly ISystemEventRepository _systemEventRepository;

    public GetSystemEventsQueryHandler(ISystemEventRepository systemEventRepository)
    {
        _systemEventRepository = systemEventRepository;
    }

    public async Task<List<SystemEvent>> Handle(GetSystemEventsQuery request, CancellationToken cancellationToken)
    {
        return await _systemEventRepository.GetAll(sortDescending: true, cancellationToken);
    }
}